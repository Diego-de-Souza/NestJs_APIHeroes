import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class ProcessAnswerQuizUseCase {
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async processAnswer(answerDto: any): Promise<ApiResponseInterface<string>> {
        try {
            const { user_id, answers, quiz_level_id } = answerDto;

            if (!user_id || !answers || !quiz_level_id) {
                return { status: 400, message: 'Dados insuficientes.' };
            }

            const questions = await this.quizRepository.findQuestionQuiz(quiz_level_id);
            if (!questions || questions.length === 0) {
                return { status: 404, message: 'Questões não encontradas.' };
            }

            const quizLevel = await this.quizRepository.findQuizLevelById(quiz_level_id);
            if (!quizLevel) {
                return { status: 404, message: 'Nível do quiz não encontrado.' };
            }

            const progress = this.processPoints(answers, questions, quizLevel.xp_reward);
            const quiz_id = await this.quizRepository.findIdQuiz(quiz_level_id);

            let _updatedProgress = false;
            const dataUserProgress = {
                user_id,
                quiz_id,
                quiz_level_id,
                completed: quizLevel.xp_reward === progress.score,
                score: progress.score,
                skipped_questions: progress.notAnswered,
                answered_questions: progress.answered,
                finished_at: new Date()
            };

            try {
                const existingProgress = await this.quizRepository.findLatestProgressByUserId(user_id);
                if (existingProgress) {
                    await this.quizRepository.updatedProgress(dataUserProgress, existingProgress.id);
                    _updatedProgress = true;
                } else {
                    await this.quizRepository.createProgress(dataUserProgress);
                }
            } catch (error) {
                // Adicione log ou rethrow
                return { status: 500, message: 'Erro ao salvar progresso.', error: error.message || error };
            }

            return {
                status: 200,
                message: 'Respostas processadas com sucesso.',
                dataUnit: _updatedProgress ? 'Progresso atualizado.' : 'Novo progresso criado.'
            };

        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao processar resposta do quiz',
                error: error.message || error
            };
        }
    }

    processPoints(
        AnswerUser: any[],
        dataquestions: any[],
        totalPoints: number
    ): { score: number; answered: number; notAnswered: number } {
        const numQuestions = dataquestions.length;
        const pointsPerQuestion = totalPoints / numQuestions;

        let score = 0;
        let answered = 0;

        for (const userAnswer of AnswerUser) {
            const question = dataquestions.find(q => q.dataValues.id === userAnswer.questionId);
            if (question) {
                answered++;
                if (question.dataValues.answer === userAnswer.selected) {
                    score += pointsPerQuestion;
                }
            }
        }

        const notAnswered = numQuestions - answered;

        return { score, answered, notAnswered };
    }
}
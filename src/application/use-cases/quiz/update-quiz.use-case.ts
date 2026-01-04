import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";
import { UpdateQuizDto } from "../../../interface/dtos/quiz/update-quiz.dto";

@Injectable()
export class UpdateQuizUseCase {

    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async updateQuiz(id: number, quizDto: UpdateQuizDto): Promise<ApiResponseInterface<unknown>> {
        try {
            const _payloadQuiz = {
                name: quizDto.name,
                theme: quizDto.theme
            };
            const _updatedQuiz = await this.quizRepository.updateQuiz(id, _payloadQuiz);

            const quizLevelsDto = quizDto.quiz_levels || [];
            const updatedLevels = [];
            const createdLevels = [];

            for (const lvl of quizLevelsDto) {
                const payload = {
                    quiz_id: id,
                    name: lvl.name_quiz_level,
                    difficulty: lvl.difficulty,
                    unlocked: typeof lvl.unlocked === 'boolean' ? lvl.unlocked : false,
                    questions: lvl.questions_count,
                    xp_reward: lvl.xp_reward
                };
                if (lvl.id && lvl.id !== null) {
                    // Atualizar nível existente
                    updatedLevels.push(await this.quizRepository.updateQuizLevel(lvl.id, payload));
                } else {
                    // Criar novo nível
                    createdLevels.push(await this.quizRepository.createQuizLevel(payload));
                }
            }

            if (_updatedQuiz <= 0 && updatedLevels.length === 0 && createdLevels.length === 0) {
                return {
                    status: 400,
                    message: 'Nenhum registro foi atualizado ou criado',
                    data: null
                };
            }

            return {
                status: 200,
                message: 'Quiz atualizado com sucesso',
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao atualizar quiz',
                error: error.message || error
            };
        }
    }
}
import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class UpdateQuizUseCase {

    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async updateQuiz(id: number, id_quiz_level:number, quizDto: any): Promise<ApiResponseInterface<any>> {
        try {
            const _payloadQuiz = {
                name: quizDto.name,
                theme: quizDto.theme
            }
            const _updatedQuiz = await this.quizRepository.updateQuiz(id, _payloadQuiz);

            const _payloadQuizLevel = {
                quiz_id: id,
                name: quizDto.quiz_levels[0].name_quiz_level,
                difficulty: quizDto.quiz_levels[0].difficulty,
                unlocked: false,
                questions: quizDto.quiz_levels[0].questions_count,
                xp_reward: quizDto.quiz_levels[0].xp_reward
            }
            const _updateQuizLevel = await this.quizRepository.updateQuizLevel(id_quiz_level, _payloadQuizLevel);

            if(_updatedQuiz <= 0 && _updateQuizLevel <0){
                return {
                    status: 400,
                    message: 'Nenhum registro foi atualizado',
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
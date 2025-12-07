import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class UpdateQuestionsUseCase {

    constructor(
        private readonly quizRepository: QuizRepository,
    ){}

    async updateQuestions(dataDto: any[]): Promise<ApiResponseInterface<any>> {
        try {
            let totalUpdated = 0;
            for (const question of dataDto) {
                const updated = await this.quizRepository.updateQuestions(question.quiz_level_id, question);
                totalUpdated += updated;
            }
            return {
                status: 200,
                message: 'Perguntas atualizadas com sucesso',
                dataUnit: { totalUpdated }
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao atualizar perguntas',
                error: error.message || error
            };
        }
    }
}
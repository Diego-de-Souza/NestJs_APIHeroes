import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { QuizRepository } from "src/infrastructure/repositories/quiz.repository";

@Injectable()
export class DeleteAllQuestionsUseCase {
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async deleteAllQuestions(quizLevelId: number): Promise<ApiResponseInterface<void>> {
        try{
            await this.quizRepository.deleteAllQuestions(quizLevelId);
            return {
                status: 200,
                message: 'Todas as perguntas foram deletadas com sucesso'
            };
        }catch(error){
            return {
                status: 500,
                message: 'Erro ao deletar perguntas',
                error: error.message || error
            };
        }
    }
}
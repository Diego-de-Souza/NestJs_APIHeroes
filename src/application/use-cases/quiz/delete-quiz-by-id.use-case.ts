import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { QuizRepository } from "src/infrastructure/repositories/quiz.repository";

@Injectable()
export class DeleteQuizByIdUseCase{
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async deleteQuizById(id: number, levelId: number): Promise<ApiResponseInterface<any>> {
        try{
            const quiz = await this.quizRepository.findQuizById(id);

            if(!quiz){
                return {
                    status: 404,
                    message: 'Quiz não encontrado',
                };
            }

            await this.quizRepository.deleteQuizById(id, levelId);

            return {
                status: 200,
                message: 'Quiz removido com sucesso',
            };
        }catch(error){
            return {
                status: 500,
                message: 'Erro ao remover quiz',
                error: error.message || error
            };
        }
    }
}
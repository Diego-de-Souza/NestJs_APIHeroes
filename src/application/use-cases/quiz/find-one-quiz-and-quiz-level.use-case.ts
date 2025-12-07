import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class FindOneQuizAndQuizLevelUseCase {
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async findOneQuizAndQuizLevel(quizId: number, levelId: number): Promise<ApiResponseInterface<any>> {
        try{
            const quiz = await this.quizRepository.findQuizById(quizId);
            const quiz_level = await this.quizRepository.findQuizLevelById(levelId);

            if (!quiz || !quiz_level) {
                return {
                    status: 404,
                    message: 'Quiz ou nível não encontrado',
                };
            }

            return {
                status: 200,
                message: 'Quiz e nível encontrados com sucesso',
                dataUnit: {
                    quiz,
                    quiz_level
                }
            };
        }catch(error){
            return {
                status: 500,
                message: 'Erro ao buscar quiz ou nível',
                error: error.message || error
            };
        }
        
    }
}
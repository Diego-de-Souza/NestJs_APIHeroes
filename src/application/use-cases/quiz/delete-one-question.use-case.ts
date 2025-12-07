import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class DeleteOneQuizUseCase {
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async deleteOneQuestion(quizLevelId: number, questionNumber: number): Promise<ApiResponseInterface<void>> {
        try{
            const questions = await this.quizRepository.findQuestionQuiz(quizLevelId);

            if(!questions || questions.length === 0) {
                return {
                    status: 404,
                    message: 'Pergunta não encontrada',
                };
            }

            const registerDelete = questions[questionNumber-1].dataValues;

            await this.quizRepository.deleteOneQuestion(registerDelete.id);
            return {
                status: 200,
                message: 'Pergunta deletada com sucesso',
            };
        }catch(error){
            console.error('Erro ao deletar pergunta:', error);
            return {
                status: 500,
                message: 'Erro ao deletar pergunta',
                error: error.message || error
            };
        }
    }
}
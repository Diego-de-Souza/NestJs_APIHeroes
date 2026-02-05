import { Injectable, Logger, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class DeleteOneQuizUseCase {
    private readonly logger = new Logger(DeleteOneQuizUseCase.name);
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async deleteOneQuestion(quizLevelId: string, questionNumber: string): Promise<ApiResponseInterface<void>> {
        try{
            const questions = await this.quizRepository.findQuestionQuiz(quizLevelId);

            if(!questions || questions.length === 0) {
                throw new NotFoundException('Pergunta não encontrada');
            }

            const index = parseInt(questionNumber, 10) - 1;
            const registerDelete = questions[index].dataValues ?? questions[index];

            await this.quizRepository.deleteOneQuestion(registerDelete.id);
            return {
                status: 200,
                message: 'Pergunta deletada com sucesso',
            };
        }catch(error){
            this.logger.error('Erro ao deletar pergunta:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Erro ao deletar pergunta');
        }
    }
}
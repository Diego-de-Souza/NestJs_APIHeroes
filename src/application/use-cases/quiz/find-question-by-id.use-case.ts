import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class FindQuestionByIdUseCase {

    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async findQuestionById(id: string): Promise<ApiResponseInterface>{
        try{
            const quiz_level = await this.quizRepository.findQuizLevelById(id);

            if(!quiz_level){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Nível de quiz não encontrado."
                }
            }

            const questions = await this.quizRepository.findQuestionQuiz(quiz_level.id);

            if(!questions || questions.length === 0){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Questões não encontradas."
                }
            }

            return {
                status: HttpStatus.OK,
                message: "Questões encontradas com sucesso.",
                data: questions
            };
        }catch(error){
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro ao buscar questão.",
                error: error.message
            }
        }
    }
}

import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { QuizRepository } from "src/infrastructure/repositories/quiz.repository";

@Injectable()
export class CreateQuestionUseCase {
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async createQuestions(questionsDTO: any): Promise<ApiResponseInterface<string>> {
        try{
            for (const question of questionsDTO.questions) {
                let _dataQuestion = {
                    quiz_level_id: questionsDTO.quiz_level_id,
                    question: question.question,
                    answer: question.answer,
                    options: question.options
                }

                let createdQuestion = await this.quizRepository.createQuestion(_dataQuestion);

                if(!createdQuestion){
                    return {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Erro ao criar a pergunta do quiz, contate o suporte."
                    }
                }
            }

            return {
                status: HttpStatus.CREATED,
                message: "Perguntas do quiz criadas com sucesso."
            };
        }catch(error){
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro ao criar as perguntas do quiz, contate o suporte."
            }
        }
    }
}
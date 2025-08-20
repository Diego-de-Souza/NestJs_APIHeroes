import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { QuizRepository } from "src/infrastructure/repositories/quiz.repository";

@Injectable()
export class FindAllQuestionsUseCase {
    constructor(private readonly quizRepository: QuizRepository) {}

    async findAllQuestions(quizLevelId: number): Promise<ApiResponseInterface<any>> {
        try{
            const questions = await this.quizRepository.findAllQuestions(quizLevelId);
            return {
                status: 200,
                message: 'Questions retrieved successfully',
                data: questions
            };
        }catch(error){
            return {
                status: 500,
                message: 'Error retrieving questions',
                data: null
            };
        }
        
    }
}
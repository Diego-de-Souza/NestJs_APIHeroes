import { Injectable } from "@nestjs/common";
import { QuizRepository } from "src/infrastructure/repositories/quiz.repository";

@Injectable()
export class FindAllQuizUseCase {

    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async getAllQuiz(): Promise<any> {
        try{
            const _quiz = await this.quizRepository.findAllQuiz();

            if(!_quiz || _quiz.length === 0) {
                return {
                    status: 404,
                    message: 'No quizzes found',
                };
            }

            const _dataQuiz: any[] = [];
            for (let _quizUnit of _quiz) {
                _dataQuiz.push({ id: _quizUnit.id, name: _quizUnit.name });
            }

            return {
                status: 200,
                message: 'Quizzes fetched successfully',
                data: _dataQuiz
            };
        }catch(error){
            return {
                status: 500,
                message: 'Error fetching quizzes',
                error: error.message || error
            };
        }
        
    }
}
import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class FindAllQuizWithLevelsUseCase {
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async getAllQuizWithLevels(): Promise<ApiResponseInterface<any>> {
        try{
            const quiz = await this.quizRepository.findAllQuiz();

            if(!quiz){
                return {
                    status: 404,
                    message: 'Quizzes não encontrados',
                };
            }

            let dataGetQuiz = [];
            for(let quizUnit of quiz){
                let quizLevels = await this.quizRepository.findAllQuizLevelsById(quizUnit.id);

                for(let level of quizLevels){
                    let _hasQuestions = await this.quizRepository.findQuestionQuiz(level.id);

                    let result = {
                        quiz_id: quizUnit.id,
                        name_quiz: quizUnit.name,
                        level_id: level.id,
                        level_name: level.name,
                        questions_count: level.questions,
                        xp_reward: level.xp_reward,
                        has_questions: false,
                        unlocked: level.unlocked,
                    }

                    if(_hasQuestions.length > 0 && _hasQuestions){
                        result.has_questions = true;
                    }

                    dataGetQuiz.push(result);
                }
            }

            return {
                status: HttpStatus.OK,
                message: 'Quizzes encontrados com níveis',
                data: dataGetQuiz
            }
        }catch(error){
            return {
                status: 500,
                message: 'Erro ao buscar quizzes com níveis',
                error: error.message || error
            };
        }
    }
}
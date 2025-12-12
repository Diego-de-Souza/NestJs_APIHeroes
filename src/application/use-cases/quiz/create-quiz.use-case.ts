import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";

@Injectable()
export class CreateQuizUseCase {
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async createQuiz(quizDTO: any): Promise<ApiResponseInterface<string>> {
        try{
            const dataQuiz = {
                name: quizDTO.name,
                logo: quizDTO.url_logo != null ? quizDTO.url_logo : 'teste',
                theme: quizDTO.theme,
            }

            const _hasQuiz = await this.quizRepository.createQuiz(dataQuiz);

            if(!_hasQuiz){
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: "Erro ao criar o quiz."
                }
            }

            for(let level of quizDTO.quiz_levels) {
                const dataQuizLevel = {
                    quiz_id: _hasQuiz.id,
                    name: level.name_quiz_level,
                    difficulty: level.difficulty,
                    unlocked: false,
                    questions: level.questions_count,
                    xp_reward: level.xp_reward
                }

                const _hasQuiz_level = await this.quizRepository.createQuizLevel(dataQuizLevel);

                if(!_hasQuiz_level){
                    return {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Erro ao criar o nível do quiz, contate o suporte."
                    }
                }
            }

            return {
                status: HttpStatus.OK,
                message: "Quiz criado com sucesso."
            }

        }catch(error){
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro ao criar o quiz, contate o suporte."
            }
        }
    }
}
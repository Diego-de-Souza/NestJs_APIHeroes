import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { QuizInterface, QuizWithLevelsInterface } from "src/domain/interfaces/quiz.interface";
import { UserQuizProgressInterface } from "src/domain/interfaces/UserQuizProgress.interface";
import { QuizRepository } from "src/infrastructure/repositories/quiz.repository";

@Injectable()
export class FindProgressQuestionsByThemeUseCase {
    
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async getProgressQuiz(userId: number): Promise<ApiResponseInterface>{
        try{
            const dataQuizzes: QuizWithLevelsInterface[] = await this.quizRepository.findAllQuizzes();

            if(dataQuizzes.length === 0){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Nenhum quiz encontrado."
                }
            }

            let dataQuizLevel:UserQuizProgressInterface = await this.quizRepository.findLatestProgressByUserId(userId);

            if(!dataQuizLevel){
                dataQuizLevel = {
                    user_id: userId,
                    quiz_id: 1,
                    quiz_level_id: 0,
                    completed: false,
                    score: 0,
                    skipped_questions: [],
                    answered_questions: [],
                    finished_at: new Date()
                }
            }

            const dataQuiz = {
                quizzes: dataQuizzes,
                progress: dataQuizLevel
            }

            dataQuiz.quizzes = this.updateStatusQuizzes(dataQuiz.quizzes, dataQuizLevel);

            return {
                status: HttpStatus.OK,
                message: "Progresso do quiz encontrado.",
                dataUnit: dataQuiz
            }


        }catch(error){
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro ao buscar progresso do quiz.",
                error: error.message
            }
        }
    }

    updateStatusQuizzes(quizzes: QuizWithLevelsInterface[] , userProgress: UserQuizProgressInterface) {
        return quizzes.map(quiz => {
            if (quiz.id === userProgress.quiz_id) {
                quiz.quiz_levels = quiz.quiz_levels.map((level, idx, arr) => {
                    // Desbloqueia todos os níveis até o atual e o próximo
                    if (level.id <= userProgress.quiz_level_id || level.id === userProgress.quiz_level_id + 1) {
                        return { ...level, unlocked: true };
                    }
                    return level;
                });
            }
            return quiz;
        });
    }
}
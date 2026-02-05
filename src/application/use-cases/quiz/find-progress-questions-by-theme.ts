import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { QuizWithLevelsInterface } from "../../../domain/interfaces/quizConst.Interface";
import { UserQuizProgressInterface } from "../../../domain/interfaces/UserQuizProgress.interface";
import { QuizRepository } from "../../../infrastructure/repositories/quiz.repository";
import { Quiz } from "../../../infrastructure/database/sequelize/models/quiz/quiz.model";

@Injectable()
export class FindProgressQuestionsByThemeUseCase {
    constructor(
        private readonly quizRepository: QuizRepository
    ){}

    async getProgressQuiz(userId: string): Promise<ApiResponseInterface> {
        try {
            const quizzes: Quiz[] = await this.quizRepository.findAllQuizzes();
            const dataQuizzes: QuizWithLevelsInterface[] = quizzes.map(q => ({
                id: q.id,
                name: q.name,
                logo: q.logo,
                theme: q.theme,
                quiz_levels: q.quiz_levels,
            }));

            if (dataQuizzes.length === 0) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Nenhum quiz encontrado."
                }
            }

            let dataQuizLevel: UserQuizProgressInterface = await this.quizRepository.findLatestProgressByUserId(userId);

            if (!dataQuizLevel) {
                dataQuizLevel = {
                    user_id: userId,
                    quiz_id: '',
                    quiz_level_id: '',
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

        } catch (error) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro ao buscar progresso do quiz.",
                error: error.message
            }
        }
    }

    updateStatusQuizzes(quizzes: QuizWithLevelsInterface[], userProgress: UserQuizProgressInterface) {
        return quizzes.map(quiz => {
            if (quiz.id === userProgress.quiz_id) {
                const currentLevelIndex = quiz.quiz_levels.findIndex(l => l.id === userProgress.quiz_level_id);
                const unlockUpToIndex = currentLevelIndex >= 0 ? currentLevelIndex + 1 : 0;
                quiz.quiz_levels = quiz.quiz_levels.map((level, index) => {
                    if (index < unlockUpToIndex || level.id === userProgress.quiz_level_id) {
                        return { ...level, unlocked: true };
                    }
                    return level;
                });
            }
            return quiz;
        });
    }
}
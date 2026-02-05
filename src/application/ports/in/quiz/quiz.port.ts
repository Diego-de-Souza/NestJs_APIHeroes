import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { CreateQuizDto } from '../../../../interface/dtos/quiz/quizCreate.dto';
import { CreateQuestionsDto } from '../../../../interface/dtos/quiz/create-questions.dto';
import { AnswerQuizDto } from '../../../../interface/dtos/quiz/answer-quiz.dto';
import { UpdateQuizDto } from '../../../../interface/dtos/quiz/update-quiz.dto';
import { UpdateQuestionsDto } from '../../../../interface/dtos/quiz/update-questions.dto';

/** Port IN: contrato do Quiz (facade). Controller → Port → QuizService → UseCases. */
export interface IQuizPort {
  createQuiz(quizDTO: CreateQuizDto): Promise<ApiResponseInterface<string>>;
  createQuestions(questionsDTO: CreateQuestionsDto): Promise<ApiResponseInterface<string>>;
  getProgressQuiz(userId: string): Promise<ApiResponseInterface>;
  getQuestionQuiz(id: string): Promise<ApiResponseInterface>;
  answerQuiz(answerDto: AnswerQuizDto): Promise<ApiResponseInterface<string>>;
  getAllQuiz(): Promise<ApiResponseInterface>;
  getAllQuizLevelsById(id: string): Promise<ApiResponseInterface<{ id: string; name: string; questionCount: number }>>;
  getAllQuizWithLevels(): Promise<ApiResponseInterface<unknown>>;
  getQuizWithLevels(id: string, levelId: string): Promise<ApiResponseInterface<unknown>>;
  getQuizQuestions(id: string): Promise<ApiResponseInterface<unknown>>;
  deleteQuizById(id: string, levelId: string): Promise<ApiResponseInterface<unknown>>;
  deleteOneQuestion(quizLevelId: string, questionNumber: string): Promise<ApiResponseInterface<unknown>>;
  deleteAllQuestions(quizLevelId: string): Promise<ApiResponseInterface<unknown>>;
  updateQuiz(id: string, quizDto: UpdateQuizDto): Promise<ApiResponseInterface<unknown>>;
  updateQuestions(dataDto: UpdateQuestionsDto): Promise<ApiResponseInterface<{ totalUpdated: number }>>;
}

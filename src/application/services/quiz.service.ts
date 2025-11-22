import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { CreateQuizDto } from "src/interface/dtos/quiz/quizCreate.dto";
import { CreateQuizUseCase } from "src/application/use-cases/quiz/create-quiz.use-case";
import { FindProgressQuestionsByThemeUseCase } from "../use-cases/quiz/find-progress-questions-by-theme";
import { FindQuestionByIdUseCase } from "src/application/use-cases/quiz/find-question-by-id.use-case";
import { ProcessAnswerQuizUseCase } from "src/application/use-cases/quiz/process-answer-quiz.use-case";
import { CreateQuestionUseCase } from "src/application/use-cases/quiz/create-questions.use-case";
import { FindAllQuizUseCase } from "src/application/use-cases/quiz/find-all-quiz.use-case";
import { FindAllQuizLevelByIdUseCase } from "src/application/use-cases/quiz/find-all-quiz-level.use-case";
import { FindAllQuizWithLevelsUseCase } from "src/application/use-cases/quiz/find-all-quiz-with-levels.use-case";
import { DeleteQuizByIdUseCase } from "src/application/use-cases/quiz/delete-quiz-by-id.use-case";
import { DeleteOneQuizUseCase } from "src/application/use-cases/quiz/delete-one-question.use-case";
import { DeleteAllQuestionsUseCase } from "src/application/use-cases/quiz/delete-all-questions.use-case";
import { FindOneQuizAndQuizLevelUseCase } from "src/application/use-cases/quiz/find-one-quiz-and-quiz-level.use-case";
import { UpdateQuizUseCase } from "src/application/use-cases/quiz/update-quiz.use-case";
import { FindAllQuestionsUseCase } from "src/application/use-cases/quiz/find-all-questions.use-case";
import { UpdateQuestionsUseCase } from "src/application/use-cases/quiz/update-questions.use-case";

@Injectable()
export class QuizService {
    
    constructor(
        private readonly createQuizUseCase: CreateQuizUseCase,
        private readonly createQuestionUseCase: CreateQuestionUseCase,
        private readonly findProgressQuestionsByTheme: FindProgressQuestionsByThemeUseCase,
        private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
        private readonly processAnswerQuizUseCase: ProcessAnswerQuizUseCase,
        private readonly findAllQuizUseCase: FindAllQuizUseCase,
        private readonly findAllQuizLevelsByIdUseCase: FindAllQuizLevelByIdUseCase,
        private readonly findAllQuizWithLevelsUseCase: FindAllQuizWithLevelsUseCase,
        private readonly findOneQuizAndQuizLevelUseCase: FindOneQuizAndQuizLevelUseCase,
        private readonly findAllQuestionsUseCase: FindAllQuestionsUseCase,
        private readonly deleteQuizByIdUseCase: DeleteQuizByIdUseCase,
        private readonly deleteOneQuizUseCase: DeleteOneQuizUseCase,
        private readonly deleteAllQuestionsUseCase: DeleteAllQuestionsUseCase,
        private readonly updateQuizUseCase: UpdateQuizUseCase,
        private readonly updateQuestionsUseCase: UpdateQuestionsUseCase,
    ){}

    async createQuiz(quizDTO: CreateQuizDto): Promise<ApiResponseInterface<string>>{
        return await this.createQuizUseCase.createQuiz(quizDTO);
    }

    async createQuestions(questionsDTO: any[]): Promise<ApiResponseInterface<string>> {
        return await this.createQuestionUseCase.createQuestions(questionsDTO);
    }

    async getProgressQuiz(userId: number): Promise<ApiResponseInterface>{
        return await this.findProgressQuestionsByTheme.getProgressQuiz(userId);
    }

    async getQuestionQuiz(id: number): Promise<any> {
        return await this.findQuestionByIdUseCase.findQuestionById(id);
    }

    async answerQuiz(answerDto: any): Promise<any> {
        return await this.processAnswerQuizUseCase.processAnswer(answerDto);
    }

    async getAllQuiz(): Promise<any> {
        return await this.findAllQuizUseCase.getAllQuiz();
    }

    async getAllQuizLevelsById(id: number): Promise<any> {
        return await this.findAllQuizLevelsByIdUseCase.getAllQuizLevelsById(id);
    }
    
    async getAllQuizWithLevels(): Promise<ApiResponseInterface<any>> {
        return await this.findAllQuizWithLevelsUseCase.getAllQuizWithLevels();
    }

    async getQuizWithLevels(id: number, levelId: number): Promise<ApiResponseInterface<any>> {
        return await this.findOneQuizAndQuizLevelUseCase.findOneQuizAndQuizLevel(id, levelId);
    }

    async getQuizQuestions(id: number): Promise<ApiResponseInterface<any>> {
        return await this.findAllQuestionsUseCase.findAllQuestions(id);
    }

    async deleteQuizById(id: number, levelId: number): Promise<ApiResponseInterface<any>> {
        return await this.deleteQuizByIdUseCase.deleteQuizById(id, levelId);
    }

    async deleteOneQuestion(quizLevelId: number, questionNumber: number): Promise<ApiResponseInterface<any>> {
        return await this.deleteOneQuizUseCase.deleteOneQuestion(quizLevelId, questionNumber);
    }

    async deleteAllQuestions(quizLevelId: number): Promise<ApiResponseInterface<any>> {
        return await this.deleteAllQuestionsUseCase.deleteAllQuestions(quizLevelId);
    }

    async updateQuiz(id: number, id_quiz_level:number, quizDto: any): Promise<ApiResponseInterface<any>> {
        return await this.updateQuizUseCase.updateQuiz(id, id_quiz_level, quizDto);
    }

    async updateQuestions(dataDto: any): Promise<ApiResponseInterface<any>> {
        return await this.updateQuestionsUseCase.updateQuestions(dataDto);
    }
}
import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateQuizDto } from "../../interface/dtos/quiz/quizCreate.dto";
import { CreateQuestionsDto } from "../../interface/dtos/quiz/create-questions.dto";
import { AnswerQuizDto } from "../../interface/dtos/quiz/answer-quiz.dto";
import { UpdateQuizDto } from "../../interface/dtos/quiz/update-quiz.dto";
import { UpdateQuestionsDto } from "../../interface/dtos/quiz/update-questions.dto";
import { CreateQuizUseCase } from "../../application/use-cases/quiz/create-quiz.use-case";
import { FindProgressQuestionsByThemeUseCase } from "../use-cases/quiz/find-progress-questions-by-theme";
import { FindQuestionByIdUseCase } from "../../application/use-cases/quiz/find-question-by-id.use-case";
import { ProcessAnswerQuizUseCase } from "../../application/use-cases/quiz/process-answer-quiz.use-case";
import { CreateQuestionUseCase } from "../../application/use-cases/quiz/create-questions.use-case";
import { FindAllQuizUseCase } from "../../application/use-cases/quiz/find-all-quiz.use-case";
import { FindAllQuizLevelByIdUseCase } from "../../application/use-cases/quiz/find-all-quiz-level.use-case";
import { FindAllQuizWithLevelsUseCase } from "../../application/use-cases/quiz/find-all-quiz-with-levels.use-case";
import { DeleteQuizByIdUseCase } from "../../application/use-cases/quiz/delete-quiz-by-id.use-case";
import { DeleteOneQuizUseCase } from "../../application/use-cases/quiz/delete-one-question.use-case";
import { DeleteAllQuestionsUseCase } from "../../application/use-cases/quiz/delete-all-questions.use-case";
import { FindOneQuizAndQuizLevelUseCase } from "../../application/use-cases/quiz/find-one-quiz-and-quiz-level.use-case";
import { UpdateQuizUseCase } from "../../application/use-cases/quiz/update-quiz.use-case";
import { FindAllQuestionsUseCase } from "../../application/use-cases/quiz/find-all-questions.use-case";
import { UpdateQuestionsUseCase } from "../../application/use-cases/quiz/update-questions.use-case";
import type { IQuizPort } from "../ports/in/quiz/quiz.port";

@Injectable()
export class QuizService implements IQuizPort {
    
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

    async createQuestions(questionsDTO: CreateQuestionsDto): Promise<ApiResponseInterface<string>> {
        return await this.createQuestionUseCase.createQuestions(questionsDTO);
    }

    async getProgressQuiz(userId: string): Promise<ApiResponseInterface>{
        return await this.findProgressQuestionsByTheme.getProgressQuiz(userId);
    }

    async getQuestionQuiz(id: string): Promise<ApiResponseInterface> {
        return await this.findQuestionByIdUseCase.findQuestionById(id);
    }

    async answerQuiz(answerDto: AnswerQuizDto): Promise<ApiResponseInterface<string>> {
        return await this.processAnswerQuizUseCase.processAnswer(answerDto);
    }

    async getAllQuiz(): Promise<ApiResponseInterface> {
        return await this.findAllQuizUseCase.getAllQuiz();
    }

    async getAllQuizLevelsById(id: string): Promise<ApiResponseInterface<{ id: string; name: string; questionCount: number }>> {
        return await this.findAllQuizLevelsByIdUseCase.getAllQuizLevelsById(id);
    }
    
    async getAllQuizWithLevels(): Promise<ApiResponseInterface<unknown>> {
        return await this.findAllQuizWithLevelsUseCase.getAllQuizWithLevels();
    }

    async getQuizWithLevels(id: string, levelId: string): Promise<ApiResponseInterface<unknown>> {
        return await this.findOneQuizAndQuizLevelUseCase.findOneQuizAndQuizLevel(id, levelId);
    }

    async getQuizQuestions(id: string): Promise<ApiResponseInterface<unknown>> {
        return await this.findAllQuestionsUseCase.findAllQuestions(id);
    }

    async deleteQuizById(id: string, levelId: string): Promise<ApiResponseInterface<unknown>> {
        return await this.deleteQuizByIdUseCase.deleteQuizById(id, levelId);
    }

    async deleteOneQuestion(quizLevelId: string, questionNumber: string): Promise<ApiResponseInterface<unknown>> {
        return await this.deleteOneQuizUseCase.deleteOneQuestion(quizLevelId, questionNumber);
    }

    async deleteAllQuestions(quizLevelId: string): Promise<ApiResponseInterface<unknown>> {
        return await this.deleteAllQuestionsUseCase.deleteAllQuestions(quizLevelId);
    }

    async updateQuiz(id: string, quizDto: UpdateQuizDto): Promise<ApiResponseInterface<unknown>> {
        return await this.updateQuizUseCase.updateQuiz(id, quizDto);
    }

    async updateQuestions(dataDto: UpdateQuestionsDto): Promise<ApiResponseInterface<{ totalUpdated: number }>> {
        return await this.updateQuestionsUseCase.updateQuestions(dataDto);
    }
}
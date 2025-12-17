import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateQuizDto } from "../dtos/quiz/quizCreate.dto";
import { QuizService } from "../../application/services/quiz.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("quiz")
export class QuizController {
    constructor(
        private readonly quizService: QuizService
    ){}

    @Post()
    @ApiOperation({ summary: 'Cria um novo do quiz' })
    @ApiResponse({ status: 201, description: 'Quiz criado com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro inesperado ao criar quiz' })
    async registro(@Body() quizDto: CreateQuizDto): Promise<ApiResponseInterface> {
        try {
          const result = await this.quizService.createQuiz(quizDto);
          return result;
        } catch (error) {
          return {
            status: 500,
            message: 'Erro inesperado ao registrar estúdio.',
            error: error.message || error,
          };
        }
    }

    @Post('create-questions')
    @ApiOperation({ summary: 'Cria novas perguntas para o quiz' })
    @ApiResponse({ status: 201, description: 'Perguntas criadas com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro inesperado ao criar perguntas' })
    async createQuestions(@Body() questionsDTO: any): Promise<ApiResponseInterface> {
        try {
          const result = await this.quizService.createQuestions(questionsDTO);
          return result;
        } catch (error) {
          return {
            status: 500,
            message: 'Erro inesperado ao registrar estúdio.',
            error: error.message || error,
          };
        }
    }

    @Get('get-progress-quiz/:userId')
    @ApiOperation({ summary: 'Busca o progresso do usuário no quiz' })
    @ApiResponse({ status: 200, description: 'Busca efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao buscar questões' })
    async getProgressQuiz(@Param('userId') userId: number): Promise<ApiResponseInterface> {
        try {
            const dataQuestions = await this.quizService.getProgressQuiz(userId);
            return dataQuestions;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao buscar progresso',
                error: error.message || error
            }
        }
    }

    @Get('find-question-quiz/:id')
    @ApiOperation({ summary: 'Busca o progresso do usuário no quiz' })
    @ApiResponse({ status: 200, description: 'Busca efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao buscar questões' })
    async getQuestionQuiz(@Param('id') id: number): Promise<any> {
        try {
            const questions = await this.quizService.getQuestionQuiz(id);
            return questions; 
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao buscar questões',
                error: error.message || error
            };
        }
    }

    @Post('answer-quiz')
    @ApiOperation({ summary: 'Recebimento de respostas das questoões' })
    @ApiResponse({ status: 200, description: 'Respostas processadas com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro no processamento das questões' })
    async answerQuiz(@Body() answerDto: any): Promise<any> {
        try {
            const result = await this.quizService.answerQuiz(answerDto);
            return result;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao buscar questões',
                error: error.message || error
            };
        }
    }

    @Get('find-All-quiz')
    @ApiOperation({ summary: 'Busca lista de quiz' })
    @ApiResponse({ status: 200, description: 'Busca efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao buscar questões' })
    async getAllQuiz(): Promise<any> {
        try {
            const questions = await this.quizService.getAllQuiz();
            return questions;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao buscar lista de quiz',
                error: error.message || error
            };
        }
    }

    @Get('find-All-quiz-levels/:id')
    @ApiOperation({ summary: 'Busca lista de níveis de quiz' })
    @ApiResponse({ status: 200, description: 'Busca efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao buscar níveis de quiz' })
    async getAllQuizLevelsById(@Param('id') id: number): Promise<any> {
        try {
            console.log(id)
            const levels = await this.quizService.getAllQuizLevelsById(id);
            return levels;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao buscar lista de níveis de quiz',
                error: error.message || error
            };
        }
    }

    @Get('find-All-quiz-with-levels')
    @ApiOperation({ summary: 'Busca lista de quiz com levels' })
    @ApiResponse({ status: 200, description: 'Busca efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao buscar níveis de quiz' })
    async getAllQuizWithLevels(): Promise<ApiResponseInterface<any>> {
        try {
            const levels = await this.quizService.getAllQuizWithLevels();
            return levels;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao buscar lista de níveis de quiz',
                error: error.message || error
            };
        }
    }

    @Get('find-quiz-with-levels/:id/level/:levelId')
    @ApiOperation({ summary: 'Busca do quiz com level' })
    @ApiResponse({ status: 200, description: 'Busca efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao buscar níveis de quiz' })
    async getQuizWithLevels(@Param('id') id: number, @Param('levelId') levelId: number): Promise<ApiResponseInterface<any>> {
        try {
            const levels = await this.quizService.getQuizWithLevels(id, levelId);
            return levels;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao buscar lista de níveis de quiz',
                error: error.message || error
            };
        }
    }

    @Get('/:id/questions')
    @ApiOperation({ summary: 'Busca questões de um quiz' })
    @ApiResponse({ status: 200, description: 'Busca efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao buscar questões' })
    async getQuizQuestions(@Param('id') id: number): Promise<ApiResponseInterface<any>> {
        try {
            const questions = await this.quizService.getQuizQuestions(id);
            return questions;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao buscar questões',
                error: error.message || error
            };
        }
    }

    @Delete('/:id/level_id/:level_id')
    @ApiOperation({ summary: 'Deletar um quiz' })
    @ApiResponse({ status: 200, description: 'Remoção efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao remover quiz' })
    async deleteQuizById(@Param('id') id: number, @Param('level_id') levelId: number): Promise<ApiResponseInterface<any>> {
        try {
            const result = await this.quizService.deleteQuizById(id, levelId);
            return result;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao remover quiz',
                error: error.message || error
            };
        }
    }

    @Delete('/:quiz_level_id/questions/:question_number')
    @ApiOperation({ summary: 'Deletar uma questão de um quiz' })
    @ApiResponse({ status: 200, description: 'Remoção efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao remover questão do quiz' })
    async deleteQuizQuestion(@Param('quiz_level_id') quizLevelId: number, @Param('question_number') questionNumber: number): Promise<ApiResponseInterface<any>> {
        try {
            const result = await this.quizService.deleteOneQuestion(quizLevelId, questionNumber);
            return result;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao remover questão do quiz',
                error: error.message || error
            };
        }
    }

    @Delete('/:quiz_level_id/questions')
    @ApiOperation({ summary: 'Deletar todas as questões de um quiz' })
    @ApiResponse({ status: 200, description: 'Remoção efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao remover questões do quiz' })
    async deleteQuizQuestions(@Param('quiz_level_id') quizLevelId: number): Promise<ApiResponseInterface<any>> {
        try {
            const result = await this.quizService.deleteAllQuestions(quizLevelId);
            return result;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao remover questão do quiz',
                error: error.message || error
            };
        }
    }

    @Put('/:id')
    @ApiOperation({ summary: 'Atualizar um quiz' })
    @ApiResponse({ status: 200, description: 'Atualização efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao atualizar quiz' })
    async updateQuiz(@Param('id') id: number, @Body() quizDto: any): Promise<ApiResponseInterface<any>> {
        try {
            const result = await this.quizService.updateQuiz(id, quizDto);
            return result;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao atualizar quiz',
                error: error.message || error
            };
        }
    }

    @Put('update-questions')
    @ApiOperation({ summary: 'Atualizar questões de um quiz' })
    @ApiResponse({ status: 200, description: 'Atualização efetuada com sucesso' })
    @ApiResponse({ status: 500, description: 'Erro ao atualizar questões do quiz' })
    async updateQuestions(@Body('data') dataDto: any): Promise<ApiResponseInterface<any>> {
        try {
            const result = await this.quizService.updateQuestions(dataDto);
            return result;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao atualizar questões do quiz',
                error: error.message || error
            };
        }
    }

}
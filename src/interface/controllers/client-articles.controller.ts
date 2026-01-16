import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, ParseIntPipe } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateArticleDto } from "../dtos/articles/articlesCreate.dto";
import { UpdateArticlesDto } from "../dtos/articles/articlesUpdate.dto";
import { DeleteManyArticlesDto } from "../dtos/articles/delete-many-articles.dto";
import { ArticlesService } from "../../application/services/articles.service";
import { Article } from "../../infrastructure/database/sequelize/models/article.model";
import { AuthGuard } from "../guards/auth.guard";
import { Request } from "express";

@Controller("client/articles")
@UseGuards(AuthGuard)
export class ClientArticlesController {

    constructor(private readonly articlesService: ArticlesService){}

    @Post()
    async create(@Body() articleDto: CreateArticleDto, @Req() req: Request): Promise<ApiResponseInterface<Article>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            // Validar que o usuario_id do DTO corresponde ao usuário autenticado
            if (articleDto.usuario_id && articleDto.usuario_id !== usuario_id) {
                return {
                    status: 403,
                    message: 'Você não pode criar artigos para outro usuário.',
                };
            }

            // Criar um novo objeto com o usuario_id correto
            const articleWithUserId = {
                ...articleDto,
                usuario_id: usuario_id
            };

            const result = await this.articlesService.createClientArticle(articleWithUserId, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao registrar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Get()
    async findAll(@Query('usuario_id', ParseIntPipe) usuario_id: number, @Req() req: Request): Promise<ApiResponseInterface<Article>> {
        try {
            const user = req['user'];
            const authenticatedUserId = user?.id || user?.sub;
            
            if (!authenticatedUserId) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            // Validar que o usuario_id da query corresponde ao usuário autenticado
            if (usuario_id !== authenticatedUserId) {
                return {
                    status: 403,
                    message: 'Você não pode visualizar artigos de outro usuário.',
                };
            }

            const result = await this.articlesService.findClientArticlesByUserId(usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Artigos.',
                error: error.message || error,
            };
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<Article>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.articlesService.findClientArticleById(id, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() articleDto: UpdateArticlesDto, @Req() req: Request): Promise<ApiResponseInterface<Article>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            // Validar que o usuario_id do DTO corresponde ao usuário autenticado
            if (articleDto.usuario_id && articleDto.usuario_id !== usuario_id) {
                return {
                    status: 403,
                    message: 'Você não pode atualizar artigos de outro usuário.',
                };
            }

            // Criar um novo objeto com o usuario_id correto
            const articleWithUserId = {
                ...articleDto,
                usuario_id: usuario_id
            };

            const result = await this.articlesService.updateClientArticle(id, articleWithUserId, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao atualizar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Delete(':id')
    async deleteOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<number>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.articlesService.deleteClientArticle(id, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Post('delete-many')
    async deleteMany(@Body() deleteDto: DeleteManyArticlesDto, @Req() req: Request): Promise<ApiResponseInterface<number>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.articlesService.deleteManyClientArticles(deleteDto.ids, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar Artigos.',
                error: error.message || error,
            };
        }
    }
}

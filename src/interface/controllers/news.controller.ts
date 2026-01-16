import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, ParseIntPipe } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateNewsDto } from "../dtos/news/create-news.dto";
import { UpdateNewsDto } from "../dtos/news/update-news.dto";
import { DeleteManyNewsDto } from "../dtos/news/delete-many-news.dto";
import { NewsService } from "../../application/services/news.service";
import { News } from "../../infrastructure/database/sequelize/models/news.model";
import { AuthGuard } from "../guards/auth.guard";
import { Request } from "express";

@Controller("client/news")
@UseGuards(AuthGuard)
export class NewsController {

    constructor(private readonly newsService: NewsService){}

    @Post()
    async create(@Body() newsDto: CreateNewsDto, @Req() req: Request): Promise<ApiResponseInterface<News>> {
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
            if (newsDto.usuario_id !== usuario_id) {
                return {
                    status: 403,
                    message: 'Você não pode criar notícias para outro usuário.',
                };
            }

            const result = await this.newsService.createNews(newsDto);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao registrar Notícia.',
                error: error.message || error,
            };
        }
    }

    @Get()
    async findAll(@Query('usuario_id', ParseIntPipe) usuario_id: number, @Req() req: Request): Promise<ApiResponseInterface<News>> {
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
                    message: 'Você não pode visualizar notícias de outro usuário.',
                };
            }

            const result = await this.newsService.findNewsByUserId(usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Notícias.',
                error: error.message || error,
            };
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<News>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.newsService.findNewsById(id, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Notícia.',
                error: error.message || error,
            };
        }
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() newsDto: UpdateNewsDto, @Req() req: Request): Promise<ApiResponseInterface<News>> {
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
            if (newsDto.usuario_id !== usuario_id) {
                return {
                    status: 403,
                    message: 'Você não pode atualizar notícias de outro usuário.',
                };
            }

            const result = await this.newsService.updateNews(id, newsDto, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao atualizar Notícia.',
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

            const result = await this.newsService.deleteNews(id, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar Notícia.',
                error: error.message || error,
            };
        }
    }

    @Post('delete-many')
    async deleteMany(@Body() deleteDto: DeleteManyNewsDto, @Req() req: Request): Promise<ApiResponseInterface<number>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.newsService.deleteManyNews(deleteDto.ids, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar Notícias.',
                error: error.message || error,
            };
        }
    }
}

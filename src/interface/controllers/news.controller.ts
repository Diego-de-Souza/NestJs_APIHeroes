import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { UpdateNewsDto } from "../dtos/news/update-news.dto";
import { DeleteManyNewsDto } from "../dtos/news/delete-many-news.dto";
import { News } from "../../infrastructure/database/sequelize/models/news.model";
import { AuthGuard } from "../guards/auth.guard";
import { Request } from "express";
import { NewsletterInterface } from "../../domain/interfaces/newsletter.interface";
import { CreateNewsletterDto } from "../dtos/news/create-newsletter.dto";
import type { ICreateNewsletterPort } from "../../application/ports/in/newsletter/create-newsletter.port";
import type { IGetListNewsletterPort } from "../../application/ports/in/newsletter/get-list-newsletter.port";
import type { IFindNewsByIdPort } from "../../application/ports/in/newsletter/find-news-by-id.port";
import type { IUpdateNewsPort } from "../../application/ports/in/newsletter/update-news.port";
import type { IDeleteNewsPort } from "../../application/ports/in/newsletter/delete-news.port";
import type { IDeleteManyNewsPort } from "../../application/ports/in/newsletter/delete-many-news.port";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import type { IFindListNewsletterPort } from "../../application/ports/in/newsletter/find-list-newsletter.port";
import type { IFindListNewsletterClientPort } from "../../application/ports/in/newsletter/find-list-newsletter-client.port";

/**
 * Controller depende apenas dos Ports IN (contratos).
 * Fluxo: Controller → Port IN (UseCase) → Port OUT (Repository) → Repository.
 */
@Controller("newsletter")
export class NewsController {

    constructor(
        @Inject('ICreateNewsletterPort') private readonly createNewsletterPort: ICreateNewsletterPort,
        @Inject('IGetListNewsletterPort') private readonly getListNewsletterPort: IGetListNewsletterPort,
        @Inject('IFindNewsByIdPort') private readonly findNewsByIdPort: IFindNewsByIdPort,
        @Inject('IUpdateNewsPort') private readonly updateNewsPort: IUpdateNewsPort,
        @Inject('IDeleteNewsPort') private readonly deleteNewsPort: IDeleteNewsPort,
        @Inject('IDeleteManyNewsPort') private readonly deleteManyNewsPort: IDeleteManyNewsPort,
        @Inject('IFindListNewsletterPort') private readonly findListNewsletterPort: IFindListNewsletterPort,
        @Inject('IFindListNewsletterClientPort') private readonly findListNewsletterClientPort: IFindListNewsletterClientPort
    ) {}

    @Get('newsletter-list')
    @ApiOperation({ summary: 'Busca todas as notícias' })
    @ApiResponse({ status: 200, description: 'Notícias encontradas com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async newsletterList(): Promise<ApiResponseInterface<NewsletterInterface>> {
        return await this.findListNewsletterPort.execute();
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Cria uma nova notícia' })
    @ApiBody({ type: CreateNewsletterDto })
    @ApiResponse({ status: 201, description: 'Notícia criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro ao criar notícia' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async create(@Body() newsDto: CreateNewsletterDto, @Req() req: Request): Promise<ApiResponseInterface<NewsletterInterface>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;

            if (!usuario_id) {
                return { status: 401, message: 'Usuário não autenticado.' };
            }
            if (newsDto.usuario_id !== usuario_id) {
                return { status: 403, message: 'Você não pode criar notícias para outro usuário.' };
            }

            return await this.createNewsletterPort.execute(newsDto);
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao registrar Notícia.', error: error.message || error };
        }
    }

    //busca de noticias para lista dentro da plataforma
    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Busca todas as notícias' })
    @ApiResponse({ status: 200, description: 'Notícias encontradas com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async findAll(@Req() req: Request): Promise<ApiResponseInterface<NewsletterInterface>> {
        try {
            const user = req['user'];
            const authenticatedUserId = user?.id || user?.sub;

            if (!authenticatedUserId) {
                return { status: 401, message: 'Usuário não autenticado.' };
            }

            return await this.getListNewsletterPort.execute();
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao buscar Notícias.', error: error.message || error };
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Busca uma notícia por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID da notícia' })
    @ApiResponse({ status: 200, description: 'Notícia encontrada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async findOne(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<News>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;

            if (!usuario_id) {
                return { status: 401, message: 'Usuário não autenticado.' };
            }

            return await this.findNewsByIdPort.execute(id, usuario_id);
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao buscar Notícia.', error: error.message || error };
        }
    }

    @Put(':id')
    @UseGuards(AuthGuard) 
    @ApiOperation({ summary: 'Atualiza uma notícia por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID da notícia' })
    @ApiBody({ type: UpdateNewsDto })
    @ApiResponse({ status: 200, description: 'Notícia atualizada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async update(@Param('id') id: string, @Body() newsDto: UpdateNewsDto, @Req() req: Request): Promise<ApiResponseInterface<News>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;

            if (!usuario_id) {
                return { status: 401, message: 'Usuário não autenticado.' };
            }
            if (newsDto.usuario_id !== usuario_id) {
                return { status: 403, message: 'Você não pode atualizar notícias de outro usuário.' };
            }

            return await this.updateNewsPort.execute(id, newsDto, String(usuario_id));
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao atualizar Notícia.', error: error.message || error };
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Deleta uma notícia por ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID da notícia' })
    @ApiResponse({ status: 200, description: 'Notícia deletada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async deleteOne(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<number>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;

            if (!usuario_id) {
                return { status: 401, message: 'Usuário não autenticado.' };
            }

            return await this.deleteNewsPort.execute(id, String(usuario_id));
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao deletar Notícia.', error: error.message || error };
        }
    }

    @Post('delete-many')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Deleta várias notícias' })
    @ApiBody({ type: DeleteManyNewsDto })
    @ApiResponse({ status: 200, description: 'Notícias deletadas com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async deleteMany(@Body() deleteDto: DeleteManyNewsDto, @Req() req: Request): Promise<ApiResponseInterface<number>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;

            if (!usuario_id) {
                return { status: 401, message: 'Usuário não autenticado.' };
            }

            return await this.deleteManyNewsPort.execute(deleteDto.ids, String(usuario_id));
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao deletar Notícias.', error: error.message || error };
        }
    }

    @Post('create-news')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Cria uma nova notícia' })
    @ApiBody({ type: CreateNewsletterDto })
    @ApiResponse({ status: 201, description: 'Notícia criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro ao criar notícia' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async createNews(@Body() newsDto: CreateNewsletterDto): Promise<ApiResponseInterface<NewsletterInterface>> {
        try {
            return await this.createNewsletterPort.execute(newsDto);
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao criar Notícia.', error: error.message || error };
        }
    }

    //clients
    @Get('client/find-all-newsletters')
    @ApiOperation({ summary: 'Busca todas as notícias para o cliente' })
    @ApiResponse({ status: 200, description: 'Notícias encontradas com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Notícias não encontradas' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async findAllNewsletters(@Query('usuario_id') usuario_id: string): Promise<ApiResponseInterface<NewsletterInterface>> {
        try{
            return await this.findListNewsletterClientPort.execute(usuario_id);
        }catch(error){
            return { status: 500, message: 'Erro inesperado ao buscar Notícias.', error: error.message || error };
        }
        
    } 

    @Post('client')
    @ApiOperation({ summary: 'Cria uma nova notícia para o cliente' })
    @ApiBody({ type: CreateNewsletterDto })
    @ApiResponse({ status: 201, description: 'Notícia criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro ao criar notícia' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async createNewsletterClient(@Body() newsDto: CreateNewsletterDto): Promise<ApiResponseInterface<NewsletterInterface>> {
        try{
            return await this.createNewsletterPort.execute(newsDto);
        }catch(error){
            return { status: 500, message: 'Erro inesperado ao criar Notícia.', error: error.message || error };
        }
        
    }

    @Get('client/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Busca uma notícia por ID para o cliente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID da notícia' })
    @ApiResponse({ status: 200, description: 'Notícia encontrada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async findOneClient(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<News>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;

            if (!usuario_id) {
                return { status: 401, message: 'Usuário não autenticado.' };
            }

            return await this.findNewsByIdPort.execute(id, usuario_id);
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao buscar Notícia.', error: error.message || error };
        }
    }

    @Put('client/:id')
    @UseGuards(AuthGuard) 
    @ApiOperation({ summary: 'Atualiza uma notícia por ID para o cliente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID da notícia' })
    @ApiBody({ type: CreateNewsletterDto })
    @ApiResponse({ status: 200, description: 'Notícia atualizada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async updateClient(@Param('id') id: string, @Body() newsDto: CreateNewsletterDto, @Req() req: Request): Promise<ApiResponseInterface<News>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;

            if (!usuario_id) {
                return { status: 401, message: 'Usuário não autenticado.' };
            }
            if (newsDto.usuario_id !== usuario_id) {
                return { status: 403, message: 'Você não pode atualizar notícias de outro usuário.' };
            }

            return await this.updateNewsPort.execute(id, newsDto, String(usuario_id));
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao atualizar Notícia.', error: error.message || error };
        }
    }

    @Delete('client/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Deleta uma notícia por ID para o cliente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID da notícia' })
    @ApiResponse({ status: 200, description: 'Notícia deletada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async deleteOneClient(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<number>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;

            if (!usuario_id) {
                return { status: 401, message: 'Usuário não autenticado.' };
            }

            return await this.deleteNewsPort.execute(id, String(usuario_id));
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao deletar Notícia.', error: error.message || error };
        }
    }
}

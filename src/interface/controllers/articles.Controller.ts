import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateArticleDto } from "../dtos/articles/articlesCreate.dto";
import { UpdateArticlesDto } from "../dtos/articles/articlesUpdate.dto";
import { Article } from "../../infrastructure/database/sequelize/models/article.model";
import { SearchArticlesDto } from "../dtos/articles/search-articles.dto";
import { SearchSuggestionsDto } from "../dtos/articles/search-suggestions.dto";
import { AuthGuard } from "../guards/auth.guard";
import type { IFindArticlesForHomepagePort } from "src/application/ports/in/article/find-articles-for-homepage.port";
import type { ICreateArticlePort } from "src/application/ports/in/article/create-article.port";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import type { IUpdateArticlePort } from "src/application/ports/in/article/update-article.port";
import type { IFindArticleByIdPort } from "src/application/ports/in/article/find-article-by-id.port";
import type { IFindAllArticlePort } from "src/application/ports/in/article/find-all-article.port";
import type { IDeleteArticlePort } from "src/application/ports/in/article/delete-article.port";
import { ISearchArticlePort } from "src/application/ports/in/article/search-article.port";
import type { IGetSearchSuggestionsPort } from "src/application/ports/in/article/get-search-suggestions.port";
import type { ICreateClientArticlePort } from "src/application/ports/in/article/create-client-article.port";
import type { IFindClientArticlesByUserIdPort } from "src/application/ports/in/article/find-client-articles-by-user-id.port";
import type { IFindClientArticleByIdPort } from "src/application/ports/in/article/find-client-article-by-id.port";
import type { IUpdateClientArticlePort } from "src/application/ports/in/article/update-client-article.port";
import type { IDeleteClientArticlePort } from "src/application/ports/in/article/delete-client-article.port";
import{ DeleteManyArticlesDto } from "../dtos/articles/delete-many-articles.dto";
import type { IDeleteManyClientArticlePort } from "src/application/ports/in/article/delete-many-client-article.port";

@Controller("articles")
export class ArticlesController {

    constructor(
        @Inject('IFindArticlesForHomepagePort') private readonly findArticlesForHomepagePort: IFindArticlesForHomepagePort,
        @Inject('ICreateArticlePort') private readonly createArticlePort: ICreateArticlePort,
        @Inject('IUpdateArticlePort') private readonly updateArticlePort: IUpdateArticlePort,
        @Inject('IFindArticleByIdPort') private readonly findArticleByIdPort: IFindArticleByIdPort,
        @Inject('IFindAllArticlePort') private readonly findAllArticlePort: IFindAllArticlePort,
        @Inject('IDeleteArticlePort') private readonly deleteArticlePort: IDeleteArticlePort,
        @Inject('ISearchArticlePort') private readonly searchArticlePort: ISearchArticlePort,
        @Inject('IGetSearchSuggestionsPort') private readonly getSearchSuggestionsPort: IGetSearchSuggestionsPort,
        @Inject('ICreateClientArticlePort') private readonly createClientArticlePort: ICreateClientArticlePort,
        @Inject('IFindClientArticlesByUserIdPort') private readonly findClientArticlesByUserIdPort: IFindClientArticlesByUserIdPort,
        @Inject('IFindClientArticleByIdPort') private readonly findClientArticleByIdPort: IFindClientArticleByIdPort,
        @Inject('IUpdateClientArticlePort') private readonly updateClientArticlePort: IUpdateClientArticlePort,
        @Inject('IDeleteClientArticlePort') private readonly deleteClientArticlePort: IDeleteClientArticlePort,
        @Inject('IDeleteManyClientArticlePort') private readonly deleteManyClientArticlePort: IDeleteManyClientArticlePort,
    ){}

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Cria um novo artigo' })
    @ApiBody({ type: CreateArticleDto })
    @ApiResponse({ status: 201, description: 'Artigo criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro ao criar artigo' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async create(@Body() article: CreateArticleDto): Promise<ApiResponseInterface<Article>> {
        try{
            const result = await this.createArticlePort.execute(article);
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao registrar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Put('update/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Atualiza um artigo' })
    @ApiBody({ type: UpdateArticlesDto })
    @ApiResponse({ status: 200, description: 'Artigo atualizado com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro ao atualizar artigo' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async update(@Body() article: UpdateArticlesDto, @Param("id") id: string): Promise<ApiResponseInterface<Article>> {
        try{
            const result = await this.updateArticlePort.execute(id, article);
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao atualizar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Get('find-one-article/:id')
    @ApiOperation({ summary: 'Busca um artigo pelo ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do artigo' })
    @ApiResponse({ status: 200, description: 'Artigo encontrado com sucesso' })
    @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async findOne(@Param("id") id: string): Promise<ApiResponseInterface<Article>> {
        try{
            const result = await this.findArticleByIdPort.execute(id);
            return result; 
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Get('find-all-articles')
    @ApiOperation({ summary: 'Busca todos os artigos' })
    @ApiResponse({ status: 200, description: 'Artigos encontrados com sucesso' })
    @ApiResponse({ status: 404, description: 'Nenhum artigo encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async findAll(): Promise<ApiResponseInterface<Article>> {
        try{
            const result = await this.findAllArticlePort.execute();
            return result; 
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Get('articles-for-homepage')
    @ApiOperation({ summary: 'Busca os artigos para a homepage' })
    @ApiResponse({ status: 200, description: 'Artigos encontrados com sucesso' })
    @ApiResponse({ status: 404, description: 'Nenhum artigo encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async articlesForHomepage(): Promise<ApiResponseInterface<Article>> {
        try{
            const result = await this.findArticlesForHomepagePort.execute();
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Artigo para homepage.',
                error: error.message || error,
            };
        }
    }

    @Delete('delete-one-article/:id')
    @ApiOperation({ summary: 'Deleta um artigo pelo ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do artigo' })
    @ApiResponse({ status: 200, description: 'Artigo deletado com sucesso' })
    @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async deleteOne(@Param("id") id: string): Promise<ApiResponseInterface<number>> {
        try{
            const result = await this.deleteArticlePort.execute(id);
            return result; 
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar Artigos.',
                error: error.message || error,
            };
        }
    }

    @Get('search')
    @ApiOperation({ summary: 'Busca artigos pelo query' })
    @ApiResponse({ status: 200, description: 'Artigos encontrados com sucesso' })
    @ApiResponse({ status: 404, description: 'Nenhum artigo encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    @ApiBody({ type: SearchArticlesDto })
    async searchArticles(@Query() searchDto: SearchArticlesDto): Promise<ApiResponseInterface<Article>> {
        try {
            const result = await this.searchArticlePort.execute(searchDto);
            return result;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro inesperado ao buscar artigos.',
                error: error.message || error,
            };
        }
    }

    @Get('search/suggestions')
    @ApiOperation({ summary: 'Busca sugestões de busca' })
    @ApiResponse({ status: 200, description: 'Sugestões encontradas com sucesso' })
    @ApiResponse({ status: 404, description: 'Nenhuma sugestão encontrada' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    @ApiBody({ type: SearchSuggestionsDto })
    async getSearchSuggestions(@Query() dto: SearchSuggestionsDto): Promise<ApiResponseInterface<string>> {
        try {
            const result = await this.getSearchSuggestionsPort.execute(dto);
            return result;
        } catch (error) {
            return {
                status: 500,
                message: 'Erro inesperado ao buscar sugestões.',
                error: error.message || error,
            };
        }
    }

    @Post('client')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Cria um novo artigo para o cliente' })
    @ApiBody({ type: CreateArticleDto })
    @ApiResponse({ status: 201, description: 'Artigo criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro ao criar artigo' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async createClientArticle(@Body() articleDto: CreateArticleDto, @Req() req: Request): Promise<ApiResponseInterface<Article>> {
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

            const result = await this.createClientArticlePort.execute(articleDto, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao registrar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Get('client/find-all-articles')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Busca todos os artigos para o cliente' })
    @ApiResponse({ status: 200, description: 'Artigos encontrados com sucesso' })
    @ApiResponse({ status: 404, description: 'Nenhum artigo encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    @ApiBody({ type: SearchArticlesDto })
    async findAllArticles(@Query('usuario_id') usuario_id: string, @Req() req: Request): Promise<ApiResponseInterface<Article>> {
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

            const result = await this.findClientArticlesByUserIdPort.execute(usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Artigos.',
                error: error.message || error,
            };
        }
    }

    @Get('client/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Busca um artigo pelo ID para o cliente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do artigo' })
    @ApiResponse({ status: 200, description: 'Artigo encontrado com sucesso' })
    @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async findOneClientArticle(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<Article>> {
        try {
            const result = await this.findClientArticleByIdPort.execute(id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Put('client/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Atualiza um artigo pelo ID para o cliente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do artigo' })
    @ApiBody({ type: UpdateArticlesDto })
    @ApiResponse({ status: 200, description: 'Artigo atualizado com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro ao atualizar artigo' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async updateClientArticle(@Param('id') id: string, @Body() articleDto: UpdateArticlesDto, @Req() req: Request): Promise<ApiResponseInterface<Article>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.updateClientArticlePort.execute(id, articleDto);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao atualizar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Delete('client/:id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Deleta um artigo pelo ID para o cliente' })
    @ApiParam({ name: 'id', type: Number, description: 'ID do artigo' })
    @ApiResponse({ status: 200, description: 'Artigo deletado com sucesso' })
    @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async deleteOneClientArticle(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<number>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.deleteClientArticlePort.execute(id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar Artigo.',
                error: error.message || error,
            };
        }
    }

    @Post('client/delete-many')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Deleta vários artigos para o cliente' })
    @ApiBody({ type: DeleteManyArticlesDto })
    @ApiResponse({ status: 200, description: 'Artigos deletados com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro ao deletar artigos' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Artigos não encontrados' })
    @ApiResponse({ status: 500, description: 'Erro inesperado' })
    async deleteManyClientArticles(@Body() deleteDto: DeleteManyArticlesDto, @Req() req: Request): Promise<ApiResponseInterface<number>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.deleteManyClientArticlePort.execute(deleteDto, usuario_id);
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

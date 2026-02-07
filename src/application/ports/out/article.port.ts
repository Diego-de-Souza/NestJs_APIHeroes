import { WhereOptions } from "sequelize";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import { CreateArticleDto } from "../../../interface/dtos/articles/articlesCreate.dto";
import { UpdateArticlesDto } from "../../../interface/dtos/articles/articlesUpdate.dto";
import { SearchSuggestionsDto } from "../../../interface/dtos/articles/search-suggestions.dto";


export interface IArticlePort {
    findArticleByName(title: string): Promise<Article>;
    createArticle(articleDto: CreateArticleDto): Promise<Article>;
    updateArticle(id: string, articleDto: UpdateArticlesDto): Promise<void>;
    findArticleById(id: string): Promise<Article>;
    DeleteArticle(id: string): Promise<number>;
    findAllArticles(): Promise<Article[]>;
    searchAllArticles(where: WhereOptions<Article>, order: any, limit: number, offset: number): Promise<Article[]>;
    countArticles(where: WhereOptions<Article>): Promise<number>;
    getSearchSuggestions(dto: SearchSuggestionsDto, limit: number): Promise<string[]>;
    findAllArticlesByUserId(usuario_id: string): Promise<Article[]>;
    deleteManyArticles(ids: string[], usuario_id: string): Promise<number>;
    findLatestArticles(limit: number): Promise<Article[]>;
    findFeaturedArticles(limit: number): Promise<Article[]>;
    findArticlesByCategory(limit: number): Promise<any>;
}
import { Injectable } from "@nestjs/common";
import { CreateArticleUseCase } from "../../application/use-cases/articles/create-articles.use-case";
import { CreateArticleDto } from "../../interface/dtos/articles/articlesCreate.dto";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { Article } from "../../infrastructure/database/sequelize/models/article.model";
import { UpdateArticlesDto } from "../../interface/dtos/articles/articlesUpdate.dto";
import { UpdateArticleUseCase } from "../../application/use-cases/articles/update-article.use-case";
import { FindArticleByIdUseCase } from "../../application/use-cases/articles/find-article-by-id.use-case";
import { FindAllArticleUseCase } from "../../application/use-cases/articles/find-all-articles.use-case";
import { DeleteArticleUseCase } from "../../application/use-cases/articles/delete-article.use-case";
import { FindArticlesForHomepageUseCase } from "../use-cases/articles/find-articles-for-homepage.use-case";
import { SearchArticlesUseCase } from "../use-cases/articles/search-articles.use-case";
import { SearchSuggestionsUseCase } from "../use-cases/articles/search-suggestions.use-case";
import { SearchArticlesDto } from "../../interface/dtos/articles/search-articles.dto";
import { SearchSuggestionsDto } from "../../interface/dtos/articles/search-suggestions.dto";

@Injectable()
export class ArticlesService{

    constructor(
        private readonly createArticleUseCase: CreateArticleUseCase,
        private readonly updateArticleUseCase: UpdateArticleUseCase,
        private readonly findArticleByIdUseCase: FindArticleByIdUseCase,
        private readonly findAllArticlesUseCase: FindAllArticleUseCase,
        private readonly deleteArticleUseCase: DeleteArticleUseCase,
        private readonly articlesForHomepageUseCase: FindArticlesForHomepageUseCase,
        private readonly searchArticlesUseCase: SearchArticlesUseCase,
        private readonly searchSuggestionsUseCase: SearchSuggestionsUseCase,
    ){}

    async createArticle(articleDto: CreateArticleDto): Promise<ApiResponseInterface<Article>>{
        return await this.createArticleUseCase.createArticle(articleDto);
    }

    async updateArticle(id:number, articleDto: UpdateArticlesDto): Promise<ApiResponseInterface<Article>>{
        return await this.updateArticleUseCase.updateArticle(id, articleDto);
    }

    async findArticleById(id: number): Promise<ApiResponseInterface<Article>>{
        return this.findArticleByIdUseCase.findArticleById(id);
    }

    async findAllArticles(): Promise<ApiResponseInterface<Article>>{
        return await this.findAllArticlesUseCase.findAllArticles();
    }

    async deleteArticle(id: number): Promise<ApiResponseInterface<number>>{
        return await this.deleteArticleUseCase.deleteArticle(id);
    }

    async articlesForHomepage(): Promise<ApiResponseInterface<Article>>{
        return await this.articlesForHomepageUseCase.articlesForHomepage();
    }

    async searchArticles(searchDto: SearchArticlesDto): Promise<ApiResponseInterface<Article>>{
        return await this.searchArticlesUseCase.execute(searchDto);
    }

    async getSearchSuggestions(searchDto: SearchSuggestionsDto): Promise<ApiResponseInterface<string>>{
        return await this.searchSuggestionsUseCase.execute(searchDto);
    }
}
import { Injectable } from "@nestjs/common";
import { CreateArticleUseCase } from "src/application/use-cases/articles/create-articles.use-case";
import { CreateArticleDto } from "src/interface/dtos/articles/articlesCreate.dto";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Article } from "src/infrastructure/database/sequelize/models/article.model";
import { UpdateArticlesDto } from "src/interface/dtos/articles/articlesUpdate.dto";
import { UpdateArticleUseCase } from "src/application/use-cases/articles/update-article.use-case";
import { FindArticleByIdUseCase } from "src/application/use-cases/articles/find-article-by-id.use-case";
import { FindAllArticleUseCase } from "src/application/use-cases/articles/find-all-articles.use-case";
import { DeleteArticleUseCase } from "src/application/use-cases/articles/delete-article.use-case";
import { FindArticlesForHomepageUseCase } from "../use-cases/articles/find-articles-for-homepage.use-case";

@Injectable()
export class ArticlesService{

    constructor(
        private readonly createArticleUseCase: CreateArticleUseCase,
        private readonly updateArticleUseCase: UpdateArticleUseCase,
        private readonly findArticleByIdUseCase: FindArticleByIdUseCase,
        private readonly findAllArticlesUseCase: FindAllArticleUseCase,
        private readonly deleteArticleUseCase: DeleteArticleUseCase,
        private readonly articlesForHomepageUseCase: FindArticlesForHomepageUseCase,
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
}
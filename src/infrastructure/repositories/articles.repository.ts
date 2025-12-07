import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Article } from "../database/sequelize/models/article.model";
import { CreateArticleDto } from "src/interface/dtos/articles/articlesCreate.dto";
import { UpdateArticlesDto } from "src/interface/dtos/articles/articlesUpdate.dto";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Op } from "sequelize";

@Injectable()
export class ArticlesRepository {

    constructor(
        @InjectModel(Article) private readonly articleModel: typeof Article
    ){}

    async findArticleByName(title: string): Promise<Article>{
        return await this.articleModel.findOne({where:{title}})
    }

    async createArticle(articleDto: CreateArticleDto): Promise<Article>{
        return await this.articleModel.create(articleDto);
    }

    async findArticleById(id:number): Promise<Article>{
        return await this.articleModel.findOne({where: {id}});
    }

    async updateArticle(id: number, articleDto: UpdateArticlesDto): Promise<void>{
        const article = new Article(articleDto);
        await this.articleModel.update(article, {where:{id}});
    }

    async findAllArticles(): Promise<Article[]>{
        return await this.articleModel.findAll();
    }

    async DeleteArticle(id: number): Promise<number> {
        return await this.articleModel.destroy({where: {id}});
    }

    async findLatestArticles(limit: number): Promise<Article[]> {
        return await this.articleModel.findAll({
            order: [['created_at', 'DESC']],
            limit: limit
        });
    }

    async findFeaturedArticles(limit: number): Promise<Article[]> {
        return await this.articleModel.findAll({
            order: [['views', 'DESC']],
            limit: limit
        });
    }

    async findArticlesByCategory(limit: number): Promise<any> {
        return await this.articleModel.findAll({
            order: [['category', 'DESC']],
            limit: limit
        })
    }

}
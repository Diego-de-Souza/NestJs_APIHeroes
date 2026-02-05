import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, QueryTypes, WhereOptions } from "sequelize";
import { Article } from "../database/sequelize/models/article.model";
import { CreateArticleDto } from "../../interface/dtos/articles/articlesCreate.dto";
import { UpdateArticlesDto } from "../../interface/dtos/articles/articlesUpdate.dto";
import type { IArticlePort } from "src/application/ports/out/article.port";
import { SearchSuggestionsDto } from "src/interface/dtos/articles/search-suggestions.dto";

@Injectable()
export class ArticlesRepository implements IArticlePort {

    constructor(
        @InjectModel(Article) private readonly articleModel: typeof Article
    ){}

    async findArticleByName(title: string): Promise<Article>{
        return await this.articleModel.findOne({where:{title}})
    }

    async createArticle(articleDto: CreateArticleDto): Promise<Article>{
        return await this.articleModel.create(articleDto);
    }

    async findArticleById(id:string): Promise<Article>{
        return await this.articleModel.findOne({where: {id}});
    }

    async updateArticle(id: string, articleDto: UpdateArticlesDto): Promise<void>{
        const article = new Article(articleDto);
        await this.articleModel.update(article, {where:{id}});
    }

    async findAllArticles(): Promise<Article[]>{
        return await this.articleModel.findAll();
    }

    async DeleteArticle(id: string): Promise<number> {
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

    async searchAllArticles(where: WhereOptions<Article>, order: any, limit: number, offset: number): Promise<Article[]> {
        return await this.articleModel.findAll({
            where,
            order,
            limit,
            offset
        });
    }

    async countArticles(where: WhereOptions<Article>): Promise<number> {
        return await this.articleModel.count({ where });
    }

    async getSearchSuggestions(dto: SearchSuggestionsDto, limit: number): Promise<string[]> {
        return await this.articleModel.sequelize.query(`
            SELECT DISTINCT title 
            FROM articles 
            WHERE title ILIKE :query 
            LIMIT :limit
          `, {
            replacements: { query: `%${dto.query}%`, limit },
            type: QueryTypes.SELECT,
          }) as any[];
    }

    // ✅ Métodos para sincronização automática
    async findByTitle(title: string): Promise<Article | null> {
        return await this.articleModel.findOne({
            where: { title }
        });
    }

    async deleteAllExceptIds(idsToKeep: string[]): Promise<number> {
        return await this.articleModel.destroy({
            where: {
                id: {
                    [Op.notIn]: idsToKeep
                }
            }
        });
    }

    async deleteAll(): Promise<number> {
        return await this.articleModel.destroy({
            where: {},
            truncate: true
        });
    }

    async findArticleByIdAndUserId(id: string, usuario_id: string): Promise<Article>{
        return await this.articleModel.findOne({where: {id, usuario_id}});
    }

    async findArticlesByUserId(usuario_id: string): Promise<Article[]>{
        return await this.articleModel.findAll({
            where: {usuario_id},
            order: [['created_at', 'DESC']]
        });
    }

    async deleteArticleByUserId(id: string, usuario_id: string): Promise<number> {
        return await this.articleModel.destroy({
            where: {
                id,
                usuario_id
            }
        });
    }

    async deleteManyArticles(ids: string[], usuario_id: string): Promise<number> {
        return await this.articleModel.destroy({
            where: {
                id: {
                    [Op.in]: ids
                },
                usuario_id
            }
        });
    }

    findAllArticlesByUserId(usuario_id: string): Promise<Article[]> {
        return this.articleModel.findAll({
            where: { usuario_id },
            order: [['created_at', 'DESC']]
        });
    }

}
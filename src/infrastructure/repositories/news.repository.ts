import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { News } from "../database/sequelize/models/news.model";
import { UpdateNewsDto } from "../../interface/dtos/news/update-news.dto";
import { Role } from "../database/sequelize/models/roles.model";
import type { INewsletterRepository } from "../../application/ports/out/newsletter.port";
import { CreateNewsletterDto } from "../../interface/dtos/news/create-newsletter.dto";

@Injectable()
export class NewsRepository implements INewsletterRepository{

    constructor(
        @InjectModel(News) private readonly newsModel: typeof News,
        @InjectModel(Role) private readonly roleModel: typeof Role
    ){}

    async createNews(newsletterDto: CreateNewsletterDto): Promise<News>{
        return await this.newsModel.create(newsletterDto);
    }

    async findNewsById(id: string): Promise<News>{
        return await this.newsModel.findOne({where: {id}});
    }

    async findNewsByIdAndUserId(id: string, usuario_id: string): Promise<News>{
        return await this.newsModel.findOne({where: {id, usuario_id}});
    }

    async findNewsByUserId(usuario_id: string): Promise<News[]>{
        return await this.newsModel.findAll({
            where: {usuario_id},
            order: [['created_at', 'DESC']]
        });
    }

    async updateNews(id: string, newsDto: UpdateNewsDto): Promise<void>{
        await this.newsModel.update(newsDto, {where: {id}});
    }

    async deleteNews(id: string): Promise<number> {
        return await this.newsModel.destroy({where: {id}});
    }

    async deleteNewsByUserId(id: string, usuario_id: string): Promise<number> {
        return await this.newsModel.destroy({
            where: {
                id,
                usuario_id
            }
        });
    }

    async deleteManyNews(ids: string[], usuario_id: string): Promise<number> {
        return await this.newsModel.destroy({
            where: {
                id: {
                    [Op.in]: ids
                },
                usuario_id
            }
        });
    }

    async findRoleByUserId(usuario_id: string): Promise<Role | null>{
        return await this.roleModel.findOne({where: {usuario_id}, attributes: ['role']});
    }

    async findListNewsletter(): Promise<News[]> {
        return await this.newsModel.findAll({
            order: [['created_at', 'DESC']]
        });
    }
}

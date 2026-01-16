import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { News } from "../database/sequelize/models/news.model";
import { CreateNewsDto } from "../../interface/dtos/news/create-news.dto";
import { UpdateNewsDto } from "../../interface/dtos/news/update-news.dto";
import { Role } from "../database/sequelize/models/roles.model";

@Injectable()
export class NewsRepository {

    constructor(
        @InjectModel(News) private readonly newsModel: typeof News,
        @InjectModel(Role) private readonly roleModel: typeof Role
    ){}

    async createNews(newsDto: CreateNewsDto): Promise<News>{
        return await this.newsModel.create(newsDto);
    }

    async findNewsById(id: number): Promise<News>{
        return await this.newsModel.findOne({where: {id}});
    }

    async findNewsByIdAndUserId(id: number, usuario_id: number): Promise<News>{
        return await this.newsModel.findOne({where: {id, usuario_id}});
    }

    async findNewsByUserId(usuario_id: number): Promise<News[]>{
        return await this.newsModel.findAll({
            where: {usuario_id},
            order: [['created_at', 'DESC']]
        });
    }

    async updateNews(id: number, newsDto: UpdateNewsDto): Promise<void>{
        await this.newsModel.update(newsDto, {where: {id}});
    }

    async deleteNews(id: number): Promise<number> {
        return await this.newsModel.destroy({where: {id}});
    }

    async deleteNewsByUserId(id: number, usuario_id: number): Promise<number> {
        return await this.newsModel.destroy({
            where: {
                id,
                usuario_id
            }
        });
    }

    async deleteManyNews(ids: number[], usuario_id: number): Promise<number> {
        return await this.newsModel.destroy({
            where: {
                id: {
                    [Op.in]: ids
                },
                usuario_id
            }
        });
    }

    async findRoleByUserId(usuario_id: number): Promise<Role | null>{
        return await this.roleModel.findOne({where: {usuario_id}, attributes: ['role']});
    }
    
}

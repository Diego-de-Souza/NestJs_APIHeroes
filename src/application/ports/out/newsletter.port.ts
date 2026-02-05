import { News } from "src/infrastructure/database/sequelize/models/news.model";
import { Role } from "src/infrastructure/database/sequelize/models/roles.model";
import { CreateNewsletterDto } from "src/interface/dtos/news/create-newsletter.dto";
import { UpdateNewsDto } from "src/interface/dtos/news/update-news.dto";


export interface INewsletterRepository {
    createNews(newsletterDto: CreateNewsletterDto): Promise<News>;
    findNewsById(id: string): Promise<News>;
    findNewsByIdAndUserId(id: string, usuario_id: string): Promise<News>;
    findNewsByUserId(usuario_id: string): Promise<News[]>;
    updateNews(id: string, newsletterDto: UpdateNewsDto): Promise<void>;
    deleteNews(id: string): Promise<number>;
    deleteNewsByUserId(id: string, usuario_id: string): Promise<number>;
    deleteManyNews(ids: string[], usuario_id: string): Promise<number>;
    findRoleByUserId(usuario_id: string): Promise<Role>;
    findListNewsletter(): Promise<News[]>;
}
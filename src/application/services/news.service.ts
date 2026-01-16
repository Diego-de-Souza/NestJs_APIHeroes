import { Injectable } from "@nestjs/common";
import { CreateNewsDto } from "../../interface/dtos/news/create-news.dto";
import { UpdateNewsDto } from "../../interface/dtos/news/update-news.dto";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { News } from "../../infrastructure/database/sequelize/models/news.model";
import { CreateNewsUseCase } from "../use-cases/news/create-news.use-case";
import { UpdateNewsUseCase } from "../use-cases/news/update-news.use-case";
import { FindNewsByIdUseCase } from "../use-cases/news/find-news-by-id.use-case";
import { FindNewsByUserIdUseCase } from "../use-cases/news/find-news-by-user-id.use-case";
import { DeleteNewsUseCase } from "../use-cases/news/delete-news.use-case";
import { DeleteManyNewsUseCase } from "../use-cases/news/delete-many-news.use-case";

@Injectable()
export class NewsService {

    constructor(
        private readonly createNewsUseCase: CreateNewsUseCase,
        private readonly updateNewsUseCase: UpdateNewsUseCase,
        private readonly findNewsByIdUseCase: FindNewsByIdUseCase,
        private readonly findNewsByUserIdUseCase: FindNewsByUserIdUseCase,
        private readonly deleteNewsUseCase: DeleteNewsUseCase,
        private readonly deleteManyNewsUseCase: DeleteManyNewsUseCase,
    ){}

    async createNews(newsDto: CreateNewsDto): Promise<ApiResponseInterface<News>>{
        return await this.createNewsUseCase.createNews(newsDto);
    }

    async updateNews(id: number, newsDto: UpdateNewsDto, usuario_id: number): Promise<ApiResponseInterface<News>>{
        return await this.updateNewsUseCase.updateNews(id, newsDto, usuario_id);
    }

    async findNewsById(id: number, usuario_id: number): Promise<ApiResponseInterface<News>>{
        return await this.findNewsByIdUseCase.findNewsById(id, usuario_id);
    }

    async findNewsByUserId(usuario_id: number): Promise<ApiResponseInterface<News>>{
        return await this.findNewsByUserIdUseCase.findNewsByUserId(usuario_id);
    }

    async deleteNews(id: number, usuario_id: number): Promise<ApiResponseInterface<number>>{
        return await this.deleteNewsUseCase.deleteNews(id, usuario_id);
    }

    async deleteManyNews(ids: number[], usuario_id: number): Promise<ApiResponseInterface<number>>{
        return await this.deleteManyNewsUseCase.deleteManyNews(ids, usuario_id);
    }
}

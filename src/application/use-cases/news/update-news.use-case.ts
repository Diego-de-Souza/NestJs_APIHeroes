import { HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { News } from "../../../infrastructure/database/sequelize/models/news.model";
import { NewsRepository } from "../../../infrastructure/repositories/news.repository";
import { UpdateNewsDto } from "../../../interface/dtos/news/update-news.dto";

@Injectable()
export class UpdateNewsUseCase {
    private readonly logger = new Logger(UpdateNewsUseCase.name);

    constructor(
        private readonly newsRepository: NewsRepository
    ){}

    async updateNews(id: number, newsDto: UpdateNewsDto, usuario_id: number): Promise<ApiResponseInterface<News>>{
        try {
            const news = await this.newsRepository.findNewsByIdAndUserId(id, usuario_id);

            if(!news){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Notícia não encontrada ou você não tem permissão para atualizá-la."
                };
            }

            await this.newsRepository.updateNews(id, newsDto);
            const updatedNews = await this.newsRepository.findNewsById(id);

            return {
                status: HttpStatus.OK,
                message: "Notícia atualizada com sucesso.",
                dataUnit: updatedNews
            };
        } catch (error) {
            this.logger.error('Erro ao atualizar notícia:', error);
            throw error;
        }
    }
}

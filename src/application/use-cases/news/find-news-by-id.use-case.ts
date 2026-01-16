import { HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { News } from "../../../infrastructure/database/sequelize/models/news.model";
import { NewsRepository } from "../../../infrastructure/repositories/news.repository";

@Injectable()
export class FindNewsByIdUseCase {
    private readonly logger = new Logger(FindNewsByIdUseCase.name);

    constructor(
        private readonly newsRepository: NewsRepository
    ){}

    async findNewsById(id: number, usuario_id: number): Promise<ApiResponseInterface<News>>{
        try {
            const news = await this.newsRepository.findNewsByIdAndUserId(id, usuario_id);

            if(!news){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Notícia não encontrada ou você não tem permissão para visualizá-la."
                };
            }

            return {
                status: HttpStatus.OK,
                message: "Notícia encontrada com sucesso.",
                dataUnit: news
            };
        } catch (error) {
            this.logger.error('Erro ao buscar notícia:', error);
            throw error;
        }
    }
}

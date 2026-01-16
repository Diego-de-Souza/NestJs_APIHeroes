import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { News } from "../../../infrastructure/database/sequelize/models/news.model";
import { NewsRepository } from "../../../infrastructure/repositories/news.repository";

@Injectable()
export class FindNewsByUserIdUseCase {
    private readonly logger = new Logger(FindNewsByUserIdUseCase.name);

    constructor(
        private readonly newsRepository: NewsRepository
    ){}

    async findNewsByUserId(usuario_id: number): Promise<ApiResponseInterface<News>>{
        try {
            const news = await this.newsRepository.findNewsByUserId(usuario_id);

            return {
                status: HttpStatus.OK,
                message: "Notícias encontradas com sucesso.",
                data: news
            };
        } catch (error) {
            this.logger.error('Erro ao buscar notícias:', error);
            throw error;
        }
    }
}

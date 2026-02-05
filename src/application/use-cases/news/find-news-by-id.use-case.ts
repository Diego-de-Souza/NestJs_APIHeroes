import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { News } from "../../../infrastructure/database/sequelize/models/news.model";
import type { INewsletterRepository } from "src/application/ports/out/newsletter.port";
import type { IFindNewsByIdPort } from "src/application/ports/in/newsletter/find-news-by-id.port";

@Injectable()
export class FindNewsByIdUseCase implements IFindNewsByIdPort {
    private readonly logger = new Logger(FindNewsByIdUseCase.name);

    constructor(
        @Inject('INewsletterRepository') private readonly newsletterRepository: INewsletterRepository
    ) {}

    async execute(id: string, usuario_id: string): Promise<ApiResponseInterface<News>> {
        try {
            const news = await this.newsletterRepository.findNewsByIdAndUserId(id, usuario_id);

            if (!news) {
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

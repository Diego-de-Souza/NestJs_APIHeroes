import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { News } from "../../../infrastructure/database/sequelize/models/news.model";
import type { INewsletterRepository } from "src/application/ports/out/newsletter.port";
import type { IUpdateNewsPort } from "src/application/ports/in/newsletter/update-news.port";
import { UpdateNewsDto } from "../../../interface/dtos/news/update-news.dto";

@Injectable()
export class UpdateNewsUseCase implements IUpdateNewsPort {
    private readonly logger = new Logger(UpdateNewsUseCase.name);

    constructor(
        @Inject('INewsletterRepository') private readonly newsletterRepository: INewsletterRepository
    ) {}

    async execute(id: string, newsDto: UpdateNewsDto, usuario_id: string): Promise<ApiResponseInterface<News>> {
        try {
            const news = await this.newsletterRepository.findNewsByIdAndUserId(id, usuario_id);

            if (!news) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Notícia não encontrada ou você não tem permissão para atualizá-la."
                };
            }

            await this.newsletterRepository.updateNews(id, newsDto);
            const updatedNews = await this.newsletterRepository.findNewsById(id);

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

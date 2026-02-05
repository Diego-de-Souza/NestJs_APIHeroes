import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { INewsletterRepository } from "src/application/ports/out/newsletter.port";
import type { IDeleteManyNewsPort } from "src/application/ports/in/newsletter/delete-many-news.port";

@Injectable()
export class DeleteManyNewsUseCase implements IDeleteManyNewsPort {
    private readonly logger = new Logger(DeleteManyNewsUseCase.name);

    constructor(
        @Inject('INewsletterRepository') private readonly newsletterRepository: INewsletterRepository
    ) {}

    async execute(ids: string[], usuario_id: string): Promise<ApiResponseInterface<number>> {
        try {
            if (!ids || ids.length === 0) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: "Nenhum ID fornecido."
                };
            }

            const deletedCount = await this.newsletterRepository.deleteManyNews(ids, usuario_id);

            return {
                status: HttpStatus.OK,
                message: `Notícias excluídas com sucesso. ${deletedCount} notícia(s) removida(s).`,
                dataUnit: deletedCount
            };
        } catch (error) {
            this.logger.error('Erro ao excluir notícias:', error);
            throw error;
        }
    }
}

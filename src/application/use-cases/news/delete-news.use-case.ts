import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { INewsletterRepository } from "../../ports/out/newsletter.port";
import type { IDeleteNewsPort } from "../../ports/in/newsletter/delete-news.port";
import { ImageService } from "../../services/image.service";

@Injectable()
export class DeleteNewsUseCase implements IDeleteNewsPort {
    private readonly logger = new Logger(DeleteNewsUseCase.name);

    constructor(
        @Inject('INewsletterRepository') private readonly newsletterRepository: INewsletterRepository,
        private readonly imageService: ImageService
    ) {}

    async execute(id: string, usuario_id: string): Promise<ApiResponseInterface<number>> {
        try {
            const news = await this.newsletterRepository.findNewsByIdAndUserId(id, usuario_id);

            if (!news) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Notícia não encontrada ou você não tem permissão para excluí-la."
                };
            }

            if(news.image){
                const deletedImage = await this.imageService.deleteImage(news.image);
                
                if(!deletedImage){
                    return {
                        status: HttpStatus.NOT_FOUND,
                        message: "Erro ao excluir imagem."
                    };
                    
                }
            }

            const deletedCount = await this.newsletterRepository.deleteNewsByUserId(id, usuario_id);

            if (deletedCount === 0) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Erro ao excluir notícia."
                };
            }

            return {
                status: HttpStatus.OK,
                message: "Notícia excluída com sucesso."
            };
        } catch (error) {
            this.logger.error('Erro ao excluir notícia:', error);
            throw error;
        }
    }
}

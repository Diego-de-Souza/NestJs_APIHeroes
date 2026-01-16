import { HttpStatus, Injectable, Logger, ForbiddenException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { NewsRepository } from "../../../infrastructure/repositories/news.repository";

@Injectable()
export class DeleteNewsUseCase {
    private readonly logger = new Logger(DeleteNewsUseCase.name);

    constructor(
        private readonly newsRepository: NewsRepository
    ){}

    async deleteNews(id: number, usuario_id: number): Promise<ApiResponseInterface<number>>{
        try {
            const news = await this.newsRepository.findNewsByIdAndUserId(id, usuario_id);
            
            if(!news){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Notícia não encontrada ou você não tem permissão para excluí-la."
                };
            }

            const deletedCount = await this.newsRepository.deleteNewsByUserId(id, usuario_id);

            if(deletedCount === 0){
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

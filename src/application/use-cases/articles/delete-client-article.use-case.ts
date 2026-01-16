import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { ArticlesRepository } from "../../../infrastructure/repositories/articles.repository";

@Injectable()
export class DeleteClientArticleUseCase {
    private readonly logger = new Logger(DeleteClientArticleUseCase.name);

    constructor(
        private readonly articlesRepository: ArticlesRepository,
        private readonly imageService: ImageService
    ){}

    async deleteClientArticle(id: number, usuario_id: number): Promise<ApiResponseInterface<number>> {
        try {
            const article = await this.articlesRepository.findArticleByIdAndUserId(id, usuario_id);
            
            if(!article){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Artigo não encontrado ou você não tem permissão para excluí-lo."
                };
            }

            const deleteArticle = await this.articlesRepository.deleteArticleByUserId(id, usuario_id);

            if(deleteArticle !== 1){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Erro ao remover o artigo."
                };
            }

            if(article && article.image){
                await this.imageService.deleteImage(article.image);
            }

            return {
                status: HttpStatus.OK,
                message: "Artigo excluído com sucesso."
            };
        } catch (error) {
            this.logger.error('Erro ao deletar artigo:', error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro interno do servidor ao deletar o artigo."
            };
        }
    }
}

import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";;
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IDeleteClientArticlePort } from "src/application/ports/in/article/delete-client-article.port";
import type { IArticlePort } from "src/application/ports/out/article.port";

@Injectable()
export class DeleteClientArticleUseCase implements IDeleteClientArticlePort {
    private readonly logger = new Logger(DeleteClientArticleUseCase.name);

    constructor(
        @Inject('IArticlePort') private readonly articlesRepository: IArticlePort,
        private readonly imageService: ImageService
    ){}

    async execute(id: string): Promise<ApiResponseInterface<number>> {
        try {
            const article = await this.articlesRepository.findArticleById(id);
            
            if(!article){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Artigo não encontrado ou você não tem permissão para excluí-lo."
                };
            }

            const deleteArticle = await this.articlesRepository.DeleteArticle(id);

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

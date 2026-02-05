import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IDeleteArticlePort } from "src/application/ports/in/article/delete-article.port";
import type { IArticlePort } from "src/application/ports/out/article.port";

@Injectable()
export class DeleteArticleUseCase implements IDeleteArticlePort {

    constructor(
        @Inject('IArticlePort') private readonly articleRepository: IArticlePort,
        private readonly imageService: ImageService
    ){}

    async execute(id: string): Promise<ApiResponseInterface<number>> {
        try{
            const articleExists = await this.articleRepository.findArticleById(id);
            
            if(!articleExists){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Artigo não encontrado."
                }
            }

            const deleteArticle = await this.articleRepository.DeleteArticle(id);

            if(deleteArticle !== 1){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Ouve um erro ao remover o ApiUriTooLongResponse."
                }
            }

            if(articleExists && articleExists.image){
                await this.imageService.deleteImage(articleExists.image);
            }

            return {
                status: HttpStatus.OK,
                message: "Artigo excluido com sucesso."
            }
        }catch(error){
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro interno do servidor ao deletar o artigo."
            }
        }
    }
}
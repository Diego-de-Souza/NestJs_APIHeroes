import { HttpStatus, Injectable } from "@nestjs/common";
import { ImageService } from "src/application/services/image.service";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { ArticlesRepository } from "src/infrastructure/repositories/articles.repository";

@Injectable()
export class DeleteArticleUseCase {

    constructor(
        private readonly articlesRepository: ArticlesRepository,
        private readonly imageService: ImageService
    ){}

    async deleteArticle(id: number): Promise<ApiResponseInterface<number>> {
        try{
            const articleExists = await this.articlesRepository.findArticleById(id);
            
            if(!articleExists){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Artigo não encontrado."
                }
            }

            const deleteArticle = await this.articlesRepository.DeleteArticle(id);

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
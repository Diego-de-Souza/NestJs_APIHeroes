import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IDeleteManyClientArticlePort } from "src/application/ports/in/article/delete-many-client-article.port";
import type{ DeleteManyArticlesDto } from "src/interface/dtos/articles/delete-many-articles.dto";
import type { IArticlePort } from "src/application/ports/out/article.port";

@Injectable()
export class DeleteManyClientArticlesUseCase implements IDeleteManyClientArticlePort {
    private readonly logger = new Logger(DeleteManyClientArticlesUseCase.name);

    constructor(
        @Inject('IArticlePort') private readonly articlesRepository: IArticlePort,
        private readonly imageService: ImageService
    ){}

    async execute(deleteDto: DeleteManyArticlesDto, usuario_id: string): Promise<ApiResponseInterface<number>>{
        try {
            if(!deleteDto || deleteDto.ids.length === 0){
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: "Nenhum ID fornecido."
                };
            }

            // Buscar todos os artigos do usuário para deletar as imagens
            const articles = await this.articlesRepository.findAllArticlesByUserId(usuario_id);
            const articlesToDelete = articles.filter(article => deleteDto.ids.includes(article.id));

            // Deletar imagens dos artigos
            for (const article of articlesToDelete) {
                if(article.image){
                    try {
                        await this.imageService.deleteImage(article.image);
                    } catch (error) {
                        this.logger.warn(`Erro ao deletar imagem do artigo ${article.id}:`, error);
                    }
                }
            }

            const deletedCount = await this.articlesRepository.deleteManyArticles(deleteDto.ids, usuario_id);

            return {
                status: HttpStatus.OK,
                message: `Artigos excluídos com sucesso. ${deletedCount} artigo(s) removido(s).`,
                dataUnit: deletedCount
            };
        } catch (error) {
            this.logger.error('Erro ao excluir artigos:', error);
            throw error;
        }
    }
}

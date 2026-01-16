import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { ArticlesRepository } from "../../../infrastructure/repositories/articles.repository";

@Injectable()
export class DeleteManyClientArticlesUseCase {
    private readonly logger = new Logger(DeleteManyClientArticlesUseCase.name);

    constructor(
        private readonly articlesRepository: ArticlesRepository,
        private readonly imageService: ImageService
    ){}

    async deleteManyClientArticles(ids: number[], usuario_id: number): Promise<ApiResponseInterface<number>>{
        try {
            if(!ids || ids.length === 0){
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: "Nenhum ID fornecido."
                };
            }

            // Buscar todos os artigos do usuário para deletar as imagens
            const articles = await this.articlesRepository.findArticlesByUserId(usuario_id);
            const articlesToDelete = articles.filter(article => ids.includes(article.id));

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

            const deletedCount = await this.articlesRepository.deleteManyArticles(ids, usuario_id);

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

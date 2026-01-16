import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import { ArticlesRepository } from "../../../infrastructure/repositories/articles.repository";
import { UpdateArticlesDto } from "../../../interface/dtos/articles/articlesUpdate.dto";

@Injectable()
export class UpdateClientArticleUseCase {
    private readonly logger = new Logger(UpdateClientArticleUseCase.name);

    constructor(
        private readonly articleRepository: ArticlesRepository,
        private readonly imageService: ImageService
    ){}

    async updateClientArticle(id: number, articleDto: UpdateArticlesDto, usuario_id: number): Promise<ApiResponseInterface<Article>>{
        try {
            const article = await this.articleRepository.findArticleByIdAndUserId(id, usuario_id);

            if(!article){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Artigo não encontrado ou você não tem permissão para atualizá-lo."
                };
            }

            let articleUpdate = {...articleDto};

            if(articleDto.image && !articleDto.image.startsWith('http')){
                if(article.image){
                    await this.imageService.deleteImage(article.image);
                }
                const imageUploadResult = await this.imageService.saveImageBase64(articleDto.image, 'articles', 'images');
                articleUpdate.image = imageUploadResult;
            }

            await this.articleRepository.updateArticle(id, articleUpdate);
            const updatedArticle = await this.articleRepository.findArticleById(id);

            return {
                status: HttpStatus.OK,
                message: "Artigo atualizado com sucesso.",
                dataUnit: updatedArticle
            };
        } catch (error) {
            this.logger.error('Erro ao atualizar artigo:', error);
            throw error;
        }
    }
}

import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import { UpdateArticlesDto } from "../../../interface/dtos/articles/articlesUpdate.dto";
import type { IUpdateClientArticlePort } from "../../../application/ports/in/article/update-client-article.port";
import type { IArticlePort } from "../../../application/ports/out/article.port";

@Injectable()
export class UpdateClientArticleUseCase implements IUpdateClientArticlePort {
    private readonly logger = new Logger(UpdateClientArticleUseCase.name);

    constructor(
        @Inject('IArticlePort') private readonly articleRepository: IArticlePort,
        private readonly imageService: ImageService
    ){}

    async execute(id: string, articleDto: UpdateArticlesDto): Promise<ApiResponseInterface<Article>>{
        try {
            const article = await this.articleRepository.findArticleById(id);

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

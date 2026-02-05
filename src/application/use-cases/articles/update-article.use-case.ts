import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import { UpdateArticlesDto } from "../../../interface/dtos/articles/articlesUpdate.dto";
import type { IUpdateArticlePort } from "src/application/ports/in/article/update-article.port";
import type { IArticlePort } from "src/application/ports/out/article.port";

@Injectable()
export class UpdateArticleUseCase implements IUpdateArticlePort {

    constructor(
        @Inject('IArticlePort') private readonly articleRepository: IArticlePort,
        private readonly imageService: ImageService
    ){}

    async execute(id: string, articleDto:UpdateArticlesDto): Promise<ApiResponseInterface<Article>>{
        const article = await this.articleRepository.findArticleById(id);

        if(!article){
            return{
                status:HttpStatus.NOT_FOUND,
                message: "Artigo não encontrado, não é possivel atualizar."
            }
        }

        let articleUpdate = {...articleDto};

        if(articleDto.image && !articleDto.image.startsWith('http')){
            await this.imageService.deleteImage(article.image);
            const imageUploadResult = await this.imageService.saveImageBase64(articleDto.image, 'articles', 'images');
            articleUpdate.image = imageUploadResult;
        }

        await this.articleRepository.updateArticle(id, articleUpdate);

        return{
            status:HttpStatus.OK,
            message: "Artigo atualizado com sucesso."
        }
    }
}
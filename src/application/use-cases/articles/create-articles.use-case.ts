import { HttpStatus, Injectable } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import { ArticlesRepository } from "../../../infrastructure/repositories/articles.repository";
import { CreateArticleDto } from "../../../interface/dtos/articles/articlesCreate.dto";

@Injectable()
export class CreateArticleUseCase {
    
    constructor(
        private readonly articleRepository: ArticlesRepository,
        private readonly imageService: ImageService
    ){}

    async createArticle(articleDto: CreateArticleDto): Promise<ApiResponseInterface<Article>>{
        const articlesExists = await this.articleRepository.findArticleByName(articleDto.title);
        let imageUploadResult;
        if(articlesExists){
            return{
                status:HttpStatus.CONFLICT,
                message: "Artigo já existe."
            }
        }

        if(articleDto.image){
            imageUploadResult = await this.imageService.saveImageBase64(articleDto.image, 'articles', 'images');
        }

        const articleToSave = {
            ...articleDto,
            image: imageUploadResult
        };

        await this.articleRepository.createArticle(articleToSave);

        return {
            status: HttpStatus.OK,
            message: "Artigo cadastrado com sucesso."
        }
    }
}
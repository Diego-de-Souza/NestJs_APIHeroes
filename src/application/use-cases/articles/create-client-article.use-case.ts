import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import { CreateArticleDto } from "../../../interface/dtos/articles/articlesCreate.dto";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import type { ICreateClientArticlePort } from "../../ports/in/article/create-client-article.port";
import type { IArticlePort } from "../../ports/out/article.port";

@Injectable()
export class CreateClientArticleUseCase implements ICreateClientArticlePort {
    private readonly logger = new Logger(CreateClientArticleUseCase.name);
    
    constructor(
        @Inject('IArticlePort') private readonly articleRepository: IArticlePort,
        private readonly imageService: ImageService,
        private readonly userRepository: UserRepository
    ){}

    async execute(articleDto: CreateArticleDto, usuario_id: string): Promise<ApiResponseInterface<Article>>{
        try {
            const articlesExists = await this.articleRepository.findArticleByName(articleDto.title);
            
            if(articlesExists){
                return {
                    status: HttpStatus.CONFLICT,
                    message: "Artigo já existe."
                };
            }

            let imageUploadResult;
            if(articleDto.image){
                imageUploadResult = await this.imageService.saveImageBase64(articleDto.image, 'articles', 'images');
            }

            const articleToSave = {
                ...articleDto,
                image: imageUploadResult,
                usuario_id: usuario_id,
                role_art: articleDto.role_art || 3 // Default para client
            };

            if(!articleDto.author){
                const user = await this.userRepository.findById(usuario_id);
                if(!user){
                    return {
                        status: HttpStatus.NOT_FOUND,
                        message: "Usuário não encontrado."
                    };
                }
                articleToSave.author = user.nickname;
            }

            const article = await this.articleRepository.createArticle(articleToSave);

            return {
                status: HttpStatus.CREATED,
                message: "Artigo criado com sucesso.",
                dataUnit: article
            };
        } catch (error) {
            this.logger.error('Erro ao criar artigo:', error);
            throw error;
        }
    }
}

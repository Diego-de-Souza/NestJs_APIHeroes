import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import { ArticlesRepository } from "../../../infrastructure/repositories/articles.repository";

@Injectable()
export class FindArticleByIdUseCase {

    constructor( private readonly articleRepository: ArticlesRepository){}

    async findArticleById(id: number): Promise<ApiResponseInterface<Article>>{
        const article = await this.articleRepository.findArticleById(id);

        if(!article){
            return{
                status: HttpStatus.NOT_FOUND,
                message: "Não foi encontrado nenhum artigo."
            }
        }

        return{
            status: HttpStatus.OK,
            message: "Artigo encontrado com sucesso.",
            dataUnit: article
        }
    }
}
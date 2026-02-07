import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import type { IFindArticleByIdPort } from "../../ports/in/article/find-article-by-id.port";
import type { IArticlePort } from "../../ports/out/article.port";

@Injectable()
export class FindArticleByIdUseCase implements IFindArticleByIdPort {

    constructor( 
        @Inject('IArticlePort') private readonly articleRepository: IArticlePort
    ){}

    async execute(id: string): Promise<ApiResponseInterface<Article>>{
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
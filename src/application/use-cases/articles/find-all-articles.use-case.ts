import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import type { IArticlePort } from "../../ports/out/article.port";
import type { IFindAllArticlePort } from "../../ports/in/article/find-all-article.port";

@Injectable()
export class FindAllArticleUseCase implements IFindAllArticlePort {

    constructor( 
        @Inject('IArticlePort') private readonly articleRepository: IArticlePort
    ){}

    async execute(): Promise<ApiResponseInterface<Article>>{
        const articles = await this.articleRepository.findAllArticles();

        if(!articles){
            return{
                status: HttpStatus.NOT_FOUND,
                message: "Não foram encontrados dados de artigos."
            }
        }
    
        return{
            status:HttpStatus.OK,
            message: "Artigos encontrados com sucesso.",
            data:articles
        }
    }
}

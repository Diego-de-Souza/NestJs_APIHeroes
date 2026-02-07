import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import type { IFindClientArticleByIdPort } from "../../ports/in/article/find-client-article-by-id.port";
import type { IArticlePort } from "../../ports/out/article.port";

@Injectable()
export class FindClientArticleByIdUseCase implements IFindClientArticleByIdPort{
    private readonly logger = new Logger(FindClientArticleByIdUseCase.name);

    constructor(
        @Inject('IArticlePort') private readonly articleRepository: IArticlePort
    ){}

    async execute(id: string): Promise<ApiResponseInterface<Article>>{
        try {
            const article = await this.articleRepository.findArticleById(id);

            if(!article){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Artigo não encontrado ou você não tem permissão para visualizá-lo."
                };
            }

            return {
                status: HttpStatus.OK,
                message: "Artigo encontrado com sucesso.",
                dataUnit: article
            };
        } catch (error) {
            this.logger.error('Erro ao buscar artigo:', error);
            throw error;
        }
    }
}

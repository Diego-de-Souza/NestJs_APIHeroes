import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import type { IFindClientArticlesByUserIdPort } from "src/application/ports/in/article/find-client-articles-by-user-id.port";
import { IArticlePort } from "src/application/ports/out/article.port";

@Injectable()
export class FindClientArticlesByUserIdUseCase implements IFindClientArticlesByUserIdPort {
    private readonly logger = new Logger(FindClientArticlesByUserIdUseCase.name);

    constructor(
        @Inject('IArticlePort') private readonly articleRepository: IArticlePort
    ){}

    async execute(usuario_id: string): Promise<ApiResponseInterface<Article>>{
        try {
            const articles = await this.articleRepository.findAllArticlesByUserId(usuario_id);

            return {
                status: HttpStatus.OK,
                message: "Artigos encontrados com sucesso.",
                data: articles
            };
        } catch (error) {
            this.logger.error('Erro ao buscar artigos:', error);
            throw error;
        }
    }
}


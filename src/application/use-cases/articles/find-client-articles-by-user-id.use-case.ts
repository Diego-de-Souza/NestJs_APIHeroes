import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import { ArticlesRepository } from "../../../infrastructure/repositories/articles.repository";

@Injectable()
export class FindClientArticlesByUserIdUseCase {
    private readonly logger = new Logger(FindClientArticlesByUserIdUseCase.name);

    constructor(
        private readonly articleRepository: ArticlesRepository
    ){}

    async findClientArticlesByUserId(usuario_id: number): Promise<ApiResponseInterface<Article>>{
        try {
            const articles = await this.articleRepository.findArticlesByUserId(usuario_id);

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


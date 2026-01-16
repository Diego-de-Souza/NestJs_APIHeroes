import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../infrastructure/database/sequelize/models/article.model";
import { ArticlesRepository } from "../../../infrastructure/repositories/articles.repository";

@Injectable()
export class FindClientArticleByIdUseCase {
    private readonly logger = new Logger(FindClientArticleByIdUseCase.name);

    constructor(
        private readonly articleRepository: ArticlesRepository
    ){}

    async findClientArticleById(id: number, usuario_id: number): Promise<ApiResponseInterface<Article>>{
        try {
            const article = await this.articleRepository.findArticleByIdAndUserId(id, usuario_id);

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

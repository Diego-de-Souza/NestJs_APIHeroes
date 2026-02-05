import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Article } from "src/infrastructure/database/sequelize/models/article.model";
import { CreateArticleDto } from "src/interface/dtos/articles/articlesCreate.dto";


export interface ICreateClientArticlePort {
    execute(dto: CreateArticleDto, usuario_id: string): Promise<ApiResponseInterface<Article>>;
}
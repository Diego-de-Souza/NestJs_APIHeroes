import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../../infrastructure/database/sequelize/models/article.model";
import { CreateArticleDto } from "../../../../interface/dtos/articles/articlesCreate.dto";


export interface ICreateClientArticlePort {
    execute(dto: CreateArticleDto, usuario_id: string): Promise<ApiResponseInterface<Article>>;
}
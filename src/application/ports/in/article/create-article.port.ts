import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../../infrastructure/database/sequelize/models/index.model";
import { CreateArticleDto } from "../../../../interface/dtos/articles/articlesCreate.dto";


export interface ICreateArticlePort {
    execute(articleDto: CreateArticleDto): Promise<ApiResponseInterface<Article>>;
}
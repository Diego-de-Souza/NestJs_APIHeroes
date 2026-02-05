import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Article } from "src/infrastructure/database/sequelize/models/index.model";
import { CreateArticleDto } from "src/interface/dtos/articles/articlesCreate.dto";


export interface ICreateArticlePort {
    execute(articleDto: CreateArticleDto): Promise<ApiResponseInterface<Article>>;
}
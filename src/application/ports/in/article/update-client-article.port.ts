import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../../infrastructure/database/sequelize/models/index.model";
import { UpdateArticlesDto } from "../../../../interface/dtos/articles/articlesUpdate.dto";


export interface IUpdateClientArticlePort {
    execute(id: string, articleDto: UpdateArticlesDto): Promise<ApiResponseInterface<Article>>;
}
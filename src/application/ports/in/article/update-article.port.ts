import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../../infrastructure/database/sequelize/models/article.model";
import { UpdateArticlesDto } from "../../../../interface/dtos/articles/articlesUpdate.dto";


export interface IUpdateArticlePort {
    execute(id: string, articleDto: UpdateArticlesDto): Promise<ApiResponseInterface<Article>>;
}
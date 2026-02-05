import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Article } from "src/infrastructure/database/sequelize/models/article.model";
import { UpdateArticlesDto } from "src/interface/dtos/articles/articlesUpdate.dto";


export interface IUpdateArticlePort {
    execute(id: string, articleDto: UpdateArticlesDto): Promise<ApiResponseInterface<Article>>;
}
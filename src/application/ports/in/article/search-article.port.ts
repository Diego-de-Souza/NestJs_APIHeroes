import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { SearchArticlesDto } from "../../../../interface/dtos/articles/search-articles.dto";
import { Article } from "../../../../infrastructure/database/sequelize/models/article.model";

export interface ISearchArticlePort {
    execute(searchDto: SearchArticlesDto): Promise<ApiResponseInterface<Article>>;
}
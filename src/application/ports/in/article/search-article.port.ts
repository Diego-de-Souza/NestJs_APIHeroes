import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { SearchArticlesDto } from "src/interface/dtos/articles/search-articles.dto";
import { Article } from "src/infrastructure/database/sequelize/models/article.model";

export interface ISearchArticlePort {
    execute(searchDto: SearchArticlesDto): Promise<ApiResponseInterface<Article>>;
}
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Article } from "src/infrastructure/database/sequelize/models/article.model";


export interface IFindArticlesForHomepagePort {
    execute(): Promise<ApiResponseInterface<Article>>;
}
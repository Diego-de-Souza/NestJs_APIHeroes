import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../../infrastructure/database/sequelize/models/article.model";


export interface IFindArticlesForHomepagePort {
    execute(): Promise<ApiResponseInterface<Article>>;
}
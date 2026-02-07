import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../../infrastructure/database/sequelize/models/index.model";


export interface IFindArticleByIdPort {
    execute(id: string): Promise<ApiResponseInterface<Article>>;
}
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Article } from "src/infrastructure/database/sequelize/models/index.model";


export interface IFindArticleByIdPort {
    execute(id: string): Promise<ApiResponseInterface<Article>>;
}
import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { Article } from "../../../../infrastructure/database/sequelize/models/index.model";


export interface IFindClientArticlesByUserIdPort {
    execute(usuario_id: string): Promise<ApiResponseInterface<Article>>;
}
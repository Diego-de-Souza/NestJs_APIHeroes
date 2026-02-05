import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Article } from "src/infrastructure/database/sequelize/models/index.model";
import { UpdateArticlesDto } from "src/interface/dtos/articles/articlesUpdate.dto";


export interface IUpdateClientArticlePort {
    execute(id: string, articleDto: UpdateArticlesDto): Promise<ApiResponseInterface<Article>>;
}
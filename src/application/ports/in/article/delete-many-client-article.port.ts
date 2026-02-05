import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { DeleteManyArticlesDto } from "src/interface/dtos/articles/delete-many-articles.dto";


export interface IDeleteManyClientArticlePort {
    execute(deleteDto: DeleteManyArticlesDto, usuario_id:string): Promise<ApiResponseInterface<number>>;
}
import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { DeleteManyArticlesDto } from "../../../../interface/dtos/articles/delete-many-articles.dto";


export interface IDeleteManyClientArticlePort {
    execute(deleteDto: DeleteManyArticlesDto, usuario_id:string): Promise<ApiResponseInterface<number>>;
}
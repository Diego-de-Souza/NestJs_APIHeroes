import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";


export interface IDeleteArticlePort {
    execute(id: string): Promise<ApiResponseInterface<number>>;
}
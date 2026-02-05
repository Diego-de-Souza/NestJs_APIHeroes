import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";


export interface IDeleteArticlePort {
    execute(id: string): Promise<ApiResponseInterface<number>>;
}
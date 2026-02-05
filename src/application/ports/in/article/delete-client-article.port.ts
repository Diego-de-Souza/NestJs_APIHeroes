import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";


export interface IDeleteClientArticlePort {
    execute(id: string): Promise<ApiResponseInterface<number>>;
}
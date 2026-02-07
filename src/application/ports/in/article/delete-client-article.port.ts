import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";


export interface IDeleteClientArticlePort {
    execute(id: string): Promise<ApiResponseInterface<number>>;
}
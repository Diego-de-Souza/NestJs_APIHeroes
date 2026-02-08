import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";


export interface IChangePasswordPort {
    execute(newPassword: string, id: string): Promise<ApiResponseInterface>;
}
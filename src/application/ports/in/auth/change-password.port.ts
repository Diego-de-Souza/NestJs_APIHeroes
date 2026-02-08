import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";


export interface IChangePasswordPort {
    execute(newPassword: string, id: string): Promise<ApiResponseInterface>;
}
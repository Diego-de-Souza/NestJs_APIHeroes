import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { ForgotPasswordDto } from "../../../../interface/dtos/auth/forgot-password.dto";


export interface IForgotPasswordPort {
    execute(dto: ForgotPasswordDto): Promise<ApiResponseInterface>;
}
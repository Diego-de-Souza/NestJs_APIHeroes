import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { ForgotPasswordDto } from "src/interface/dtos/auth/forgot-password.dto";


export interface IForgotPasswordPort {
    execute(dto: ForgotPasswordDto): Promise<ApiResponseInterface>;
}
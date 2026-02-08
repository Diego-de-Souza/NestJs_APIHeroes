import { HttpStatus, Injectable } from "@nestjs/common";
import { IForgotPasswordPort } from "../../ports/in/auth/forgot-password.port";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { ForgotPasswordDto } from "../../../interface/dtos/auth/forgot-password.dto";

@Injectable()
export class ForgotPasswordUseCase implements IForgotPasswordPort{
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(dto: ForgotPasswordDto): Promise<ApiResponseInterface> {
        try{
            const user = await this.authRepository.forgotPassword(dto.email, dto.dob, dto.cpf);
            
            if(!user){
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Usuário não encontrado."
                };
            }

            const returnData = {
                fullname: user.fullname,
                id: user.id,
            }

            return {
                status: HttpStatus.OK,
                message: "Senha recuperada com sucesso.",
                dataUnit: returnData
            };
        }catch(error){
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro ao recuperar a senha."
            };
        }
    }
}
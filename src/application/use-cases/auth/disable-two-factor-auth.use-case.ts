import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { Request } from 'express';

@Injectable()
export class DisableTwoFactorAuthUseCase {
    constructor(private readonly authRepository: AuthRepository) {}

    async disableTwoFactorAuth(req: Request): Promise<ApiResponseInterface> {
        try{
            const userId = (req as any).user?.sub;
            if (!userId) {
                return {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'Usuário não autenticado.'
                };
            }
            const deletedTotpSecret = await this.authRepository.deleteTotpSecret(userId);
            if (!deletedTotpSecret) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Usuário não encontrado ou autenticação de dois fatores já desabilitada.'
                };
            }
            return {
                status: HttpStatus.OK,
                message: 'Autenticação de dois fatores desabilitada com sucesso.'
            };

        }catch(error){
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: `Erro ao desabilitar a autenticação de dois fatores. (use-case): ${error.message}`,
            };
        }
    }
}

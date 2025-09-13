import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { Request } from 'express';
import { HttpStatus } from "@nestjs/common";

@Injectable()
export class FindSettingsUserUseCase {
    constructor(private authRepository: AuthRepository) {}

    async getUserSettings(req: Request, type: string): Promise<ApiResponseInterface> {
        try {
            const userId = (req as any).user?.sub;
            if (!userId) {
                return {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'Usuário não autenticado.'
                };
            }

            const user = await this.authRepository.findUserById(userId);
            if (!user) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Usuário não encontrado.'
                };
            }

            if(type === 'security'){
                return {
                    status: HttpStatus.OK,
                    message: 'Configurações de segurança do usuário.',
                    data: [
                        {totp_enabled: user.totp_secret? true : false},
                        {active_sections: user.firstemail}
                    ]
                };
            }
        } catch (error) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: `Erro ao obter configurações do usuário. (use-case): ${error.message}`,
            };
        }
    }
}
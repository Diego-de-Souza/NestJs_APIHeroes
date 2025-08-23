import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { TokenUseCase } from "./token.use-case";
import { AuthService } from "src/application/services/auth.service";
import { Response } from 'express';

@Injectable()
export class AuthChangePasswordUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userRepository: UserRepository,
        private readonly tokenUseCase: TokenUseCase,
        private readonly authService: AuthService
    ){}

    async changePassword(newPassword: string, res: Response): Promise<ApiResponseInterface> {
        try{
            // Extrair o ID do usuário do token de acesso (assumindo que você tenha um método para isso)
            const userId = await this.tokenUseCase.extractUserIdFromToken(res.locals.user);

            if (!userId) {
                return {
                    status: HttpStatus.UNAUTHORIZED,
                    message: "Usuário não autenticado."
                };
            }

            const user = await this.authRepository.findUserById(userId);

            if (!user) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Usuário não encontrado."
                };
            }

            const hashedPassword = await this.authService.generateHash(newPassword);

            await this.userRepository.updatePassword(user.id,hashedPassword);

            return {
                status: HttpStatus.OK,
                message: "Senha alterada com sucesso."
            };
        }catch(error){
            console.error("Erro ao alterar a senha:", error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Erro ao alterar a senha."
            };
        }
    }
}
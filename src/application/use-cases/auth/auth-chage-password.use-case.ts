import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { TokenUseCase } from "./token.use-case";
import { GenenerateHashUseCase } from "./generate-hash.use-case";
import { Request } from 'express';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthChangePasswordUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userRepository: UserRepository,
        private readonly tokenUseCase: TokenUseCase,
        private readonly generateHashUseCase: GenenerateHashUseCase,
        private readonly configService: ConfigService
    ){}

    async changePassword(newPassword: string, req: Request): Promise<ApiResponseInterface> {
        try{
            const userId = (req as any).user?.sub;

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

            const ENCRYPTION_KEY = this.configService.get<string>('ENCRYPTION_KEY');
            const decryptedPassword = CryptoJS.AES.decrypt(newPassword, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

            console.log(decryptedPassword)
            const hashedPassword = await this.generateHashUseCase.generateHash(decryptedPassword);

            await this.userRepository.updatePassword(user.dataValues.id,hashedPassword);

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
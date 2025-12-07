import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Request } from 'express';
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";

@Injectable()
export class AuthTotpQRCodeUseCase{
    
    constructor(
        private readonly authRepository: AuthRepository
    ){}

    async generateTotpQRCode(req: Request): Promise<ApiResponseInterface> {
        try {
            const user = (req as any).user;
            if (!user || !user.sub) {
                return {
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'Usuário não autenticado.'
                };
            }

            let existingUser = await this.authRepository.findUserById(user.sub);
            if (!existingUser) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Usuário não encontrado.'
                };
            }

            const secret = authenticator.generateSecret();

            await this.authRepository.saveSecretTOTP(existingUser.id, secret);

            const otpauth = authenticator.keyuri(existingUser.firstemail, 'Plataforma Heroes', secret);

            const qrCodeDataURL = await qrcode.toDataURL(otpauth);

            return {
                status: 200,
                message: 'QR Code gerado com sucesso.',
                dataUnit: [
                    qrCodeDataURL,
                    secret
                ]
            };
        } catch (error) {
            return {
                status: 500,
                message: 'Erro ao gerar QR Code.',
                error: error.message
            };
        }
    }

    async validateTotpCode(req: Request, code: string): Promise<ApiResponseInterface> {
        try {
            const user = (req as any).user;
            if (!user || !user.sub) {
                throw new UnauthorizedException('Usuário não autenticado.');
            }

            const existingUser = await this.authRepository.findUserById(user.sub);
            if (!existingUser || !existingUser.totp_secret) {
                throw new UnauthorizedException('Segredo TOTP não encontrado para o usuário.');
            }

            const isValid = authenticator.check(code, existingUser.totp_secret);

            if (isValid) {
                return {
                    status: 200,
                    message: 'Código TOTP válido.',
                };
            } else {
                throw new UnauthorizedException('Código TOTP inválido.');
            }
        } catch (error) {
            throw new UnauthorizedException('Erro ao validar código TOTP.', error.message);
        }
    }
}
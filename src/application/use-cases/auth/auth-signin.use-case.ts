import { Injectable, Logger } from "@nestjs/common";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { PasswordUseCase } from "./password.use-case";
import { TokenUseCase } from "./token.use-case";
import { Request } from 'express';
import { SignInResponse } from "../../../domain/interfaces/auth.interface";

@Injectable()
export class AuthSignInUseCase {
    private readonly logger = new Logger(AuthSignInUseCase.name);

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passawordUseCase: PasswordUseCase,
        private readonly tokenUseCase: TokenUseCase
    ){}

    async signIn(email: string, pass: string, req: Request): Promise<SignInResponse> {
        try{
            const user = await this.authRepository.findByEmail(email);

            if (!user) {
                throw new Error("Usuário não encontrado.");
            }

            if(user.dataValues.password === 'userSocial'){
                throw new Error("O usuário só tem o login social ativo, precisa logar com login social e atualizar os dados na área de configurações do usuario.")
            }

            const role = await this.authRepository.findRoleByUserId(user.dataValues.id);
            const match = await this.passawordUseCase.validatyPassword(pass, user.dataValues.password);

            if (!match) {
                throw new Error("Credenciais inválidas.");
            }

            await this.authRepository.deleteAllUserValidations(user.dataValues.id);
            
            const accessToken = await this.tokenUseCase.generateToken(user.dataValues, role?.dataValues);
            const refreshToken = await this.tokenUseCase.generateRefreshToken(user.dataValues);

            // Cookies desabilitados temporariamente porque o Vercel não aceita cookies
            // A autenticação é feita via header 'x-session-token' retornado na resposta

            const tokenId = await this.tokenUseCase.generateBinario(user.dataValues.id);

            const clientIp = req.ip || 
                           req.connection?.remoteAddress || 
                           req.socket?.remoteAddress || 
                           (req.connection as any)?.socket?.remoteAddress ||
                           req.headers['x-forwarded-for'] as string ||
                           req.headers['x-real-ip'] as string ||
                           'unknown';

            const validation = await this.authRepository.createValidation({
                user_id: user.dataValues.id,
                access_token: accessToken,
                refresh_token: refreshToken,
                token_id: tokenId,
                expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 min
                device_info: req.headers['user-agent'] || 'unknown',
                ip_address: Array.isArray(clientIp) ? clientIp[0] : clientIp,
                is_active: true
            });

            if(!validation){
                throw new Error("Erro ao criar validação de login.");
            }

            const hasTotp = user.dataValues.totp_secret ? true : false;

            return {
                message: 'Login realizado com sucesso',
                has_totp: hasTotp,
                session_token: tokenId,
                user: {
                    id: user.dataValues.id,
                    nickname: user.dataValues.nickname,
                    email: user.dataValues.firstemail,
                    role: role?.dataValues?.role,
                    access_role: role?.dataValues?.access
                }
            };
        }catch(error){
            this.logger.error("Erro ao realizar login:", error.message);
            throw new Error(`Credenciais inválidas ou usuário não encontrado: ${error}`)
        }
    }
}
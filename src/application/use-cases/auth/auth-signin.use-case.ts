import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { PasswordUseCase } from "./password.use-case";
import { TokenUseCase } from "./token.use-case";
import { Request } from 'express';

@Injectable()
export class AuthSignInUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passawordUseCase: PasswordUseCase,
        private readonly tokenUseCase: TokenUseCase
    ){}

    async signIn(email: string, pass: string, req: Request): Promise<any> {
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

            const isProduction = process.env.NODE_ENV === 'production';

            //no vercel não esta funcionando o set cookie, por isso foi comentado temporariamente
            // // Cookie para access_token
            // res.cookie('access_token', accessToken, {
            //     httpOnly: true,
            //     secure: isProduction,
            //     sameSite: 'none',
            //     path: '/',
            //     maxAge: 15 * 60 * 1000 // 15 minutos
            // });

            // // Cookie para refresh_token
            // res.cookie('refresh_token', refreshToken, {
            //     httpOnly: true,
            //     secure: isProduction,
            //     sameSite: 'none',
            //     path: '/',
            //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
            // });

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
                    role: role?.dataValues?.role
                }
            };
        }catch(error){
            console.error("Erro ao realizar login:", error.message);
            throw new Error(`Credenciais inválidas ou usuário não encontrado: ${error}`)
        }
    }
}
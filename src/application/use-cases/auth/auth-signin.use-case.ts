import { Injectable } from "@nestjs/common";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { PasswordUseCase } from "./password.use-case";
import { TokenUseCase } from "./token.use-case";
import { Response } from 'express';

@Injectable()
export class AuthSignInUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passawordUseCase: PasswordUseCase,
        private readonly tokenUseCase: TokenUseCase
    ){}

    async signIn(email: string, pass: string, res: Response): Promise<any> {
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

            if(role){

            }

            const accessToken = await this.tokenUseCase.generateToken(user.dataValues, role.dataValues);

            const refreshToken = await this.tokenUseCase.generateRefreshToken(user.dataValues);

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: true, // apenas HTTPS
                sameSite: 'strict',
                path: '/', // ou só na rota de refresh
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
            });

            const hasTotp = user.dataValues.totp_secret ? true : false;

            return {
                access_token: accessToken,
                has_totp: hasTotp
            };
        }catch(error){
            console.error("Erro ao realizar login:", error.message);

            throw new Error(`Credenciais inválidas ou usuário não encontrado: ${error}`)
        }
    
    }
}
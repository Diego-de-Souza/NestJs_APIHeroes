import { HttpStatus, Injectable } from "@nestjs/common";
import { OAuth2Client } from 'google-auth-library';
import { TokenUseCase } from "./token.use-case";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { Response } from 'express';

@Injectable()
export class AuthSignInGoogleUseCase {
    private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly tokenUseCase: TokenUseCase
    ) {}

  async authSignInGoogle(token: string, res: Response): Promise<any> {
    try{
        const ticket = await this.googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        let user = await this.findOrCreateUser(payload);

        if(user){
            return {
                status: HttpStatus.CONFLICT,
                message: user.error
            }
        }

        const role = await this.authRepository.findRoleByUserId(user.user.id);

        const accessToken = this.tokenUseCase.generateToken(user.user, role.dataValues);

        const refreshToken = await this.tokenUseCase.generateRefreshToken(user.user);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true, // apenas HTTPS
            sameSite: 'strict',
            path: '/', // ou só na rota de refresh
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
        });

        return {
            access_token: accessToken
        };  
    }catch(error){
        console.error("Erro ao realizar login:", error.message);

        throw new Error(`Credenciais inválidas ou usuário não encontrado: ${error}`)
    }
  }

  async findOrCreateUser(payload: any) {
    const email = payload.email;
    const name = payload.name;
    const provider = 'google';
    try{
        let _hasUserSocial = await this.authRepository.findOneUserSocial(email, provider);

        let _hasUser = await this.userRepository.findByEmail(email);

        if(!_hasUserSocial && !_hasUser){
            const _userPayload = {
                fullname: payload.name,
                nickname: payload.name,
                firstemail: payload.email,
                password: 'userSocial',
                created_at: new Date()
            }

            const _newUser = await this.authRepository.createUser(_userPayload);

            if(!_newUser){
                return{
                    message: 'Não foi possível criar usuario.'
                }
            }

            const _userSocialPayload = {
                user_id: _newUser.id,
                email: payload.email,
                provider: provider,
                provider_id: payload.sub,
                created_at: new Date()
            }

            const _newUserSocial = await this.authRepository.createUserSocial(_userSocialPayload);

            if(!_newUserSocial){
                return {
                    message: 'Não foi possível criar usuario social.'
                }
            }

            return {
                user: _newUser,
                user_social:_newUserSocial
            }
        }else if(!_hasUserSocial && _hasUser){
            const _userSocialPayload = {
                user_id: _hasUser.id,
                email: payload.email,
                provider: provider,
                provider_id: payload.sub,
                created_at: new Date()
            }

            const _newUserSocial = await this.authRepository.createUserSocial(_userSocialPayload);

            if(!_newUserSocial){
                return {
                    message: 'Não foi possível criar usuario social.'
                }
            }

            return {
                user: _hasUser,
                user_social: _newUserSocial
            }
        } else if(_hasUserSocial && _hasUser){
            return {
                user: _hasUser,
                user_social: _hasUserSocial
            }
        } else{
            return{
                error: 'Ouve um erro na busca ou criação do usuário e usuario social, contate o suporte!'
            }
        }

    }catch(error){
        return {
            error: 'Ouve um erro na busca ou criação do usuário e usuario social, contate o suporte!'
        }
    }
  }
}

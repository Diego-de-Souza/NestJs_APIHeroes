import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { AuthSignInUseCase } from "../use-cases/auth/auth-signin.use-case";
import { Response } from 'express';
import { FindAccessTokenUseCase } from "../use-cases/auth/find-acess-toke.use-case";
import { AuthSignInGoogleUseCase } from "../use-cases/auth/auth-signin-google.use-case";

@Injectable()
export class AuthService {
    
    constructor(
        private config: ConfigService,
        private readonly authSignInUseCase: AuthSignInUseCase,
        private readonly findAccessTokenUseCase: FindAccessTokenUseCase,
        private readonly authSignInGoogleUseCase: AuthSignInGoogleUseCase
    ){}

    async generateHash(pass: string): Promise<any>{
        try{
            const saltRounds = this.config.get('SALT_ROUNDS')
        
            if (!saltRounds) {
                throw new Error("A variável de ambiente SALT_ROUNDS não está configurada.");
            }
        
            const salt = await bcrypt.genSalt(parseInt(saltRounds));
            const hashedPassword = await bcrypt.hash(pass, salt);
        
            return hashedPassword;
        }catch(error){
            console.error("Erro ao gerar o hash da senha:", error);
            throw new Error("Erro ao processar a senha.");
        }
    }
    
    async signIn(email: string, pass: string, res: Response): Promise<any>{
        return await this.authSignInUseCase.signIn(email, pass, res);
    }

    async findAccessToken(req, res): Promise<ApiResponseInterface<string>>{
        return await this.findAccessTokenUseCase.findAccessToken(req, res);
    }

    async googleAuth(token: string, res: Response): Promise<ApiResponseInterface> {
        return await this.authSignInGoogleUseCase.authSignInGoogle(token, res);
    }

}
import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { AuthSignInUseCase } from "../use-cases/auth/auth-signin.use-case";
import { Response } from 'express';
import { FindAccessTokenUseCase } from "../use-cases/auth/find-acess-toke.use-case";
import { AuthSignInGoogleUseCase } from "../use-cases/auth/auth-signin-google.use-case";
import { AuthChangePasswordUseCase } from "../use-cases/auth/auth-chage-password.use-case";
import { Request } from 'express';

@Injectable()
export class AuthService {
    
    constructor(
        private readonly authSignInUseCase: AuthSignInUseCase,
        private readonly findAccessTokenUseCase: FindAccessTokenUseCase,
        private readonly authSignInGoogleUseCase: AuthSignInGoogleUseCase,
        private readonly authChangePasswordUseCase: AuthChangePasswordUseCase,
    ){}
    
    async signIn(email: string, pass: string, res: Response): Promise<any>{
        return await this.authSignInUseCase.signIn(email, pass, res);
    }

    async findAccessToken(req, res): Promise<ApiResponseInterface<string>>{
        return await this.findAccessTokenUseCase.findAccessToken(req, res);
    }

    async googleAuth(token: string, res: Response): Promise<ApiResponseInterface> {
        return await this.authSignInGoogleUseCase.authSignInGoogle(token, res);
    }

    async changePassword(newPassword: string, req: Request): Promise<ApiResponseInterface> {
        return await this.authChangePasswordUseCase.changePassword(newPassword, req);
    }

}
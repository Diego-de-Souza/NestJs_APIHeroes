import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { AuthSignInUseCase } from "../../application/use-cases/auth/auth-signin.use-case";
import { Response } from 'express';
import { AuthSignInGoogleUseCase } from "../../application/use-cases/auth/auth-signin-google.use-case";
import { AuthChangePasswordUseCase } from "../../application/use-cases/auth/auth-chage-password.use-case";
import { Request } from 'express';
import { AuthTotpQRCodeUseCase } from "../../application/use-cases/auth/auth-generate-totp-qrcode.use-case";
import { FindSettingsUserUseCase } from "../../application/use-cases/auth/find-settings-user.use-case";
import { DisableTwoFactorAuthUseCase } from "../../application/use-cases/auth/disable-two-factor-auth.use-case";
import { GenerateCodeInUseCase } from "../../application/use-cases/auth/auth-generate-code.use-case";
import { AuthSignOutUseCase } from "../use-cases/auth/auth-signout.use-case";
import { AuthRefreshTokenUseCase } from "../use-cases/auth/auth-refresh-token.use-case";

@Injectable()
export class AuthService {
    
    constructor(
        private readonly authSignInUseCase: AuthSignInUseCase,
        private readonly authSignInGoogleUseCase: AuthSignInGoogleUseCase,
        private readonly authChangePasswordUseCase: AuthChangePasswordUseCase,
        private readonly authTotpQRCodeUseCase: AuthTotpQRCodeUseCase,
        private readonly generateCodeInUseCase: GenerateCodeInUseCase,
        private readonly disableTwoFactorAuthUseCase: DisableTwoFactorAuthUseCase,
        private readonly findSettingsUserUseCase: FindSettingsUserUseCase,
        private readonly authSignOutUseCase: AuthSignOutUseCase,
        private readonly refreshTokenUseCase: AuthRefreshTokenUseCase
    ){}
    
    async signIn(email: string, pass: string, res: Response): Promise<any>{
        return await this.authSignInUseCase.signIn(email, pass, res);
    }

    async refreshToken(refreshToken: string,  res: Response): Promise<any>{
        return await this.refreshTokenUseCase.refreshAccessToken(refreshToken, res);
    }

    async googleAuth(token: string, res: Response): Promise<ApiResponseInterface> {
        return await this.authSignInGoogleUseCase.authSignInGoogle(token, res);
    }

    async changePassword(newPassword: string, req: Request): Promise<ApiResponseInterface> {
        return await this.authChangePasswordUseCase.changePassword(newPassword, req);
    }

    async generateTotpQRCode(req: Request): Promise<ApiResponseInterface> {
        return await this.authTotpQRCodeUseCase.generateTotpQRCode(req);
    }

    async generateMfaCode(req: Request, typeCanal: string): Promise<ApiResponseInterface> {
        return await this.generateCodeInUseCase.generateMfaCode(req, typeCanal);
    }

    async disableTwoFactorAuth(req: Request): Promise<ApiResponseInterface> {
        return await this.disableTwoFactorAuthUseCase.disableTwoFactorAuth(req);
    }

    async validateTotpCode(req: Request, code: string): Promise<ApiResponseInterface> {
        return await this.authTotpQRCodeUseCase.validateTotpCode(req, code);
    }

    async validateMfaCode(req: Request, code: string, typeCanal: string): Promise<ApiResponseInterface> {
        return await this.generateCodeInUseCase.validateMfaCode(req, code, typeCanal);
    }

    async getUserSettings(req: Request, type: string): Promise<ApiResponseInterface> {
        return await this.findSettingsUserUseCase.getUserSettings(req, type);
    }

    async generateCodePassword(typeCanal: string, data: string): Promise<ApiResponseInterface> {
        return await this.generateCodeInUseCase.generateCodePassword(typeCanal, data);
    }

    async signOut(res: Response): Promise<any> {
        return await this.authSignOutUseCase.signOut(res);
    }

}
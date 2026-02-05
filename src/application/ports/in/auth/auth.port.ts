import { Request, Response } from 'express';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { SignOutResponse } from '../../../../domain/interfaces/auth.interface';

/** Port IN: contrato do Auth (facade). Controller → Port → AuthService → UseCases. */
export interface IAuthPort {
  signIn(email: string, pass: string, req: Request): Promise<ApiResponseInterface | unknown>;
  refreshToken(refreshToken: string, res: Response): Promise<ApiResponseInterface | unknown>;
  googleAuth(token: string, res: Response): Promise<ApiResponseInterface>;
  changePassword(newPassword: string, req: Request): Promise<ApiResponseInterface>;
  generateTotpQRCode(req: Request): Promise<ApiResponseInterface>;
  generateMfaCode(req: Request, typeCanal: string): Promise<ApiResponseInterface>;
  disableTwoFactorAuth(req: Request): Promise<ApiResponseInterface>;
  validateTotpCode(req: Request, code: string): Promise<ApiResponseInterface>;
  validateMfaCode(req: Request, code: string, typeCanal: string): Promise<ApiResponseInterface>;
  getUserSettings(req: Request, type: string): Promise<ApiResponseInterface>;
  generateCodePassword(typeCanal: string, data: string): Promise<ApiResponseInterface>;
  signOut(req: Request): Promise<SignOutResponse>;
  signOutCurrentSession(req: Request): Promise<SignOutResponse>;
  signOutCurrentSessionById(id: string, req: Request): Promise<SignOutResponse>;
  getActiveSessions(userId: string, currentSessionToken?: string): Promise<ApiResponseInterface | unknown>;
  registerAcessoUser(req: Request): Promise<ApiResponseInterface<{ registered: boolean; message: string }>>;
}

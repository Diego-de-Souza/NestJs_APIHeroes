import { Injectable } from "@nestjs/common";
import { Response, Request } from 'express';
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";

@Injectable()
export class AuthSignOutUseCase {
    constructor(
        private readonly authRepository: AuthRepository
    ){}

    async signOut(res: Response, req: Request): Promise<any> {
        try {
            //invalidado temporariamente porque o vercel não aceita os cookies
            // // Limpa os cookies
            // res.clearCookie('access_token', { 
            //     path: '/',
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
            // });
            
            // res.clearCookie('refresh_token', { 
            //     path: '/',
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
            // });

            const sessionToken = req.headers['x-session-token'] || 
                               req.query.session_token ||
                               req.body.session_token;

            if (!sessionToken) {
                return {
                    status: 400,
                    message: 'Token de sessão não fornecido'
                };
            }

            // ✅ BUSCA A VALIDAÇÃO PARA PEGAR O USER_ID
            const validation = await this.authRepository.findValidationByTokenId(sessionToken);
            
            if (validation) {
                // ✅ REMOVE TODAS AS SESSÕES DO USUÁRIO (LOGOUT DE TODOS OS DISPOSITIVOS)
                await this.authRepository.deleteAllUserValidations(validation.user_id);
                
                console.log(`Logout realizado para usuário ID: ${validation.user_id}`);
            }

            return {
                status: 200,
                message: 'Logout realizado com sucesso'
            };
        } catch (error) {
            console.error("Erro ao realizar logout:", error.message);
            throw new Error(`Erro ao realizar logout: ${error.message}`);
        }
    }

    async signOutCurrentSession(req: Request): Promise<any> {
        try {
            const sessionToken = req.headers['x-session-token'] || 
                               req.query.session_token ||
                               req.body.session_token;

            if (!sessionToken) {
                return {
                    status: 400,
                    message: 'Token de sessão não fornecido'
                };
            }

            // ✅ REMOVE APENAS A SESSÃO ATUAL
            await this.authRepository.deleteValidationByTokenId(sessionToken);

            return {
                status: 200,
                message: 'Logout da sessão atual realizado com sucesso'
            };
        } catch (error) {
            console.error("Erro ao realizar logout da sessão:", error.message);
            throw new Error(`Erro ao realizar logout: ${error.message}`);
        }
    }

    async signOutCurrentSessionById(id: string, req: Request): Promise<any> {
        try {
            await this.authRepository.deleteValidationById(id);
            return {
                status: 200,
                message: 'Logout da sessão especificada realizado com sucesso'
            };
        } catch (error) {
            console.error("Erro ao realizar logout da sessão especificada:", error.message);
            throw new Error(`Erro ao realizar logout: ${error.message}`);
        }
    }
}
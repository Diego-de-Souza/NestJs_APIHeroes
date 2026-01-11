import { Injectable, Logger } from "@nestjs/common";
import { Response, Request } from 'express';
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { SignOutResponse } from "../../../domain/interfaces/auth.interface";

@Injectable()
export class AuthSignOutUseCase {
    private readonly logger = new Logger(AuthSignOutUseCase.name);

    constructor(
        private readonly authRepository: AuthRepository
    ){}

    async signOut(req: Request): Promise<SignOutResponse> {
        try {
            // Cookies desabilitados temporariamente porque o Vercel não aceita cookies
            // A autenticação é feita via header 'x-session-token'

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
                
                this.logger.log(`Logout realizado para usuário ID: ${validation.user_id}`);
            }

            return {
                status: 200,
                message: 'Logout realizado com sucesso'
            };
        } catch (error) {
            this.logger.error("Erro ao realizar logout:", error.message);
            throw new Error(`Erro ao realizar logout: ${error.message}`);
        }
    }

    async signOutCurrentSession(req: Request): Promise<SignOutResponse> {
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
            this.logger.error("Erro ao realizar logout da sessão:", error.message);
            throw new Error(`Erro ao realizar logout: ${error.message}`);
        }
    }

    async signOutCurrentSessionById(id: string, req: Request): Promise<SignOutResponse> {
        try {
            await this.authRepository.deleteValidationById(id);
            return {
                status: 200,
                message: 'Logout da sessão especificada realizado com sucesso'
            };
        } catch (error) {
            this.logger.error("Erro ao realizar logout da sessão especificada:", error.message);
            throw new Error(`Erro ao realizar logout: ${error.message}`);
        }
    }
}
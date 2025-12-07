import { Injectable } from "@nestjs/common";
import { Response } from 'express';

@Injectable()
export class AuthSignOutUseCase {
    async signOut(res: Response): Promise<any> {
        try {
            // Limpa os cookies
            res.clearCookie('access_token', { 
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
            });
            
            res.clearCookie('refresh_token', { 
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
            });

            return {
                status: 200,
                message: 'Logout realizado com sucesso'
            };
        } catch (error) {
            console.error("Erro ao realizar logout:", error.message);
            throw new Error(`Erro ao realizar logout: ${error.message}`);
        }
    }
}
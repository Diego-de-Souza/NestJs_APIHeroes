// auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../shared/utils/constants/constants';
import { Request, Response } from 'express';
import { AuthRefreshTokenUseCase } from '../../application/use-cases/auth/auth-refresh-token.use-case';
import { AuthRepository } from 'src/infrastructure/repositories/auth.repository';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private authRefreshTokenUseCase: AuthRefreshTokenUseCase,
        private authRepository: AuthRepository
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse<Response>();
        
        const sessionToken = request.headers['x-session-token'] || 
                           request.query.session_token ||
                           request.body.session_token;

        if (!sessionToken) {
            throw new UnauthorizedException('Token de sessão não fornecido');
        }

        const validation = await this.authRepository.findValidationByTokenId(sessionToken);
        
        if (!validation || !validation.is_active) {
            throw new UnauthorizedException('Sessão inválida');
        }

        const now = new Date();
        const accessTokenExpired = now > validation.expires_at;

        if (accessTokenExpired) {
            try {
                const refreshTokenValid = await this.isRefreshTokenValid(validation.refresh_token);
                
                if (!refreshTokenValid) {
                    console.log('❌ Refresh token também expirado');
                    await this.authRepository.deactivateValidation(sessionToken);
                    throw new UnauthorizedException('Sessão completamente expirada. Faça login novamente.');
                }

                const renewResult = await this.authRefreshTokenUseCase.refreshAccessToken(validation.refresh_token, response);
                
                if (!renewResult || renewResult.status !== 200) {
                    console.log('❌ Falha ao renovar token');
                    await this.authRepository.deactivateValidation(sessionToken);
                    throw new UnauthorizedException('Falha ao renovar sessão');
                }

                const decoded = await this.jwtService.verifyAsync(renewResult.access_token, {
                    secret: jwtConstants.secret
                });
                
                request['user'] = decoded;
                
                await this.authRepository.updateValidationToken(
                    sessionToken, 
                    renewResult.access_token, 
                    renewResult.refresh_token, 
                    renewResult.expires_at
                );
                
                return true;

            } catch (error) {
                console.error('❌ Erro ao renovar token:', error);
                await this.authRepository.deactivateValidation(sessionToken);
                throw new UnauthorizedException('Erro ao renovar sessão. Faça login novamente.');
            }
        }

        try {
            const decoded = await this.jwtService.verifyAsync(validation.access_token, {
                secret: jwtConstants.secret
            });
            
            request['user'] = decoded;
            
            // ✅ ATUALIZA LAST_USED_AT
            await this.authRepository.updateValidationLastUsed(sessionToken);

            return true;
            
        } catch (error) {
            console.error('❌ Token de acesso corrompido:', error);
            await this.authRepository.deactivateValidation(sessionToken);
            throw new UnauthorizedException('Token de acesso inválido');
        }
    }

    private async isRefreshTokenValid(refreshToken: string): Promise<boolean> {
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: jwtConstants.refreshSecret || jwtConstants.secret
            });
            
            return true; 
        } catch (error) {
            console.log('❌ Refresh token inválido:', error.message);
            return false;
        }
    }
}
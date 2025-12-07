import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from '../../shared/utils/constants/constants';
  import { Request, Response } from 'express';
  import { AuthRefreshTokenUseCase } from 'src/application/use-cases/auth/auth-refresh-token.use-case';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private authRefreshTokenUseCase: AuthRefreshTokenUseCase
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const accessToken = this.extractTokenFromCookie(request, 'access_token');
      
      // Tenta validar o access token
      try {
        if (accessToken) {
          const payload = await this.jwtService.verifyAsync(accessToken, {
            secret: jwtConstants.secret
          });
          request['user'] = payload;
          return true;
        }
      } catch (error) {
        // Access token expirado ou inválido
        console.log('Access token inválido/expirado, tentando renovar...');
      }

      // Se falhou, tenta renovar com refresh token
      const refreshToken = this.extractTokenFromCookie(request, 'refresh_token');
      
      if (!refreshToken) {
        throw new UnauthorizedException('Token não fornecido');
      }

      try {
        // Renova o access token (atualiza o cookie)
        const result = await this.authRefreshTokenUseCase.refreshAccessToken(refreshToken, response);
        
        // Valida o novo token
        const newPayload = await this.jwtService.verifyAsync(result.access_token, {
          secret: jwtConstants.secret
        });
        
        request['user'] = newPayload;
        console.log('Token renovado com sucesso');
        return true;

      } catch (error) {
        console.error('Erro ao renovar token:', error.message);
        throw new UnauthorizedException('Sessão expirada. Faça login novamente.');
      }
    }
  
    private extractTokenFromCookie(request: Request, cookieName: string): string | undefined {
      return request.cookies?.[cookieName];
    }
  }
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/shared/utils/constants/constants";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { TokenUseCase } from "./token.use-case";
import { Response } from 'express';

@Injectable()
export class AuthRefreshTokenUseCase {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authRepository: AuthRepository,
        private readonly tokenUseCase: TokenUseCase
    ) {}

    async refreshAccessToken(refreshToken: string, res: Response): Promise<any> {
        try {
            // Verifica se o refresh token é válido
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: jwtConstants.refreshSecret
            });

            // Busca os dados atualizados do usuário
            const user = await this.authRepository.findUserById(payload.id || payload.sub);
            
            if (!user) {
                throw new UnauthorizedException('Usuário não encontrado');
            }

            const role = await this.authRepository.findRoleByUserId(user.dataValues.id);

            // Gera um novo access token
            const newAccessToken = await this.tokenUseCase.generateToken(
                user.dataValues, 
                role?.dataValues
            );

            const isProduction = process.env.NODE_ENV === 'production';

            // Atualiza o cookie do access_token
            res.cookie('access_token', newAccessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'strict' : 'lax',
                path: '/',
                maxAge: 15 * 60 * 1000 // 15 minutos
            });

            return {
                status: 200,
                message: 'Token renovado com sucesso',
                access_token: newAccessToken
            };

        } catch (error) {
            throw new UnauthorizedException('Refresh token inválido ou expirado');
        }
    }
}
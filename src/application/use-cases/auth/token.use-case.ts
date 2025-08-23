import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenUseCase {

    constructor(private jwtService: JwtService){}

    async generateToken(userData: any, role: any): Promise<any>{
        try{
            const payload = {
                sub: userData.id,
                username: userData.fullname,
                role: role.role,
                nickname: userData.nickname,
                access: role.access,
            };

            const accessToken = await this.jwtService.signAsync(payload, {
                expiresIn: '15m',
            });

            return accessToken; 
        }catch(error){

        }
    }

    async generateRefreshToken(userData: any): Promise<any> {
        try {
            const payload = { sub: userData.userId, username: userData.username };
            
            const refreshToken = await this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret', 
                expiresIn: '1d', 
            });
    
            return refreshToken;
        } catch (error) {
            console.error('Erro ao gerar refresh token:', error);
            throw new Error('Não foi possível gerar o refresh token.');
        }
    }

    async verifyRefreshToken(token: string): Promise<any> {
        try {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_REFRESH_SECRET, 
        });
    
        return payload;
        } catch (err) {
            throw new UnauthorizedException('Refresh token inválido ou expirado');
        }
    }

    async extractUserIdFromToken(token: string): Promise<number | null> {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_ACCESS_SECRET,
            });
            return payload.sub;
        } catch (error) {
            console.error('Erro ao extrair o ID do usuário do token:', error);
            return null;
        }
    }
}
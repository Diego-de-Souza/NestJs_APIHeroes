import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from "../../../shared/utils/constants/constants";
@Injectable()
export class TokenUseCase {

    constructor(private jwtService: JwtService){}

    async generateToken(user: any, role?: any): Promise<string> {
        const payload = {
        sub: user.id,
        id: user.id,
        nickname: user.nickname,
        email: user.firstemail,
        role: role?.role || 'user',
        };

        return this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '15m', // 15 minutos
        });
    }

   async generateRefreshToken(user: any): Promise<string> {
        const payload = {
        sub: user.id,
        id: user.id,
        };

        return this.jwtService.signAsync(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d', // 7 dias
        });
    }

    async verifyRefreshToken(token: string): Promise<any> {
        try {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.refreshSecret, 
        });
    
        return payload;
        } catch (err) {
            throw new UnauthorizedException('Refresh token inválido ou expirado');
        }
    }

    async generateBinario(id: string | number): Promise<string> {
        return typeof id === 'number' ? id.toString(2) : id;
    }
}
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const jwtConstants = {
    secret: configService.get<string>('SECRET_KEY'),
    refreshSecret: configService.get<string>('REFRESH_SECRET_KEY'),
};
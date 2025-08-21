import { forwardRef, Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from 'src/infrastructure/database/sequelize/models/index.model';
import { UserModule } from './user.module';
import { AuthController } from '../controllers/auth.controller';
import { jwtConstants } from 'src/shared/utils/constants/constants';
import { AuthService } from 'src/application/services/auth.service';
import { AuthRepository } from 'src/infrastructure/repositories/auth.repository';
import { AuthSignInUseCase } from 'src/application/use-cases/auth/auth-signin.use-case';
import { FindAccessTokenUseCase } from 'src/application/use-cases/auth/find-acess-toke.use-case';
import { TokenUseCase } from 'src/application/use-cases/auth/token.use-case';
import { PasswordUseCase } from 'src/application/use-cases/auth/password.use-case';
import { AuthSignInGoogleUseCase } from 'src/application/use-cases/auth/auth-signin-google.use-case';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule,
    SequelizeModule.forFeature(models),
    forwardRef(() => UserModule)
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthSignInUseCase,
    AuthSignInGoogleUseCase,
    FindAccessTokenUseCase,
    AuthRepository,
    TokenUseCase,
    PasswordUseCase
  ],
  exports: [AuthService]
})
export class AuthModule {}

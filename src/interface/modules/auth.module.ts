import { forwardRef, Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { UserModule } from './user.module';
import { AuthController } from '../../interface/controllers/auth.controller';
import { jwtConstants } from '../../shared/utils/constants/constants';
import { AuthService } from '../../application/services/auth.service';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';
import { AuthSignInUseCase } from '../../application/use-cases/auth/auth-signin.use-case';
import { TokenUseCase } from '../../application/use-cases/auth/token.use-case';
import { PasswordUseCase } from '../../application/use-cases/auth/password.use-case';
import { AuthSignInGoogleUseCase } from '../../application/use-cases/auth/auth-signin-google.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { AuthChangePasswordUseCase } from '../../application/use-cases/auth/auth-chage-password.use-case';
import { GenenerateHashUseCase } from '../../application/use-cases/auth/generate-hash.use-case';
import { AuthTotpQRCodeUseCase } from '../../application/use-cases/auth/auth-generate-totp-qrcode.use-case';
import { FindSettingsUserUseCase } from '../../application/use-cases/auth/find-settings-user.use-case';
import { DisableTwoFactorAuthUseCase } from '../../application/use-cases/auth/disable-two-factor-auth.use-case';
import { GenerateCodeInUseCase } from '../../application/use-cases/auth/auth-generate-code.use-case';
import { AuthSignOutUseCase } from '../../application/use-cases/auth/auth-signout.use-case';
import { AuthRefreshTokenUseCase } from '../../application/use-cases/auth/auth-refresh-token.use-case';

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
    AuthChangePasswordUseCase,
    GenenerateHashUseCase,
    AuthRefreshTokenUseCase,
    AuthTotpQRCodeUseCase,
    GenerateCodeInUseCase,
    DisableTwoFactorAuthUseCase,
    FindSettingsUserUseCase,
    AuthRepository,
    UserRepository,
    TokenUseCase,
    PasswordUseCase,
    ConfigService,
    AuthSignOutUseCase
  ],
  exports: [
    AuthService,
  AuthRefreshTokenUseCase,
  AuthRepository,
  TokenUseCase
]
})
export class AuthModule {}

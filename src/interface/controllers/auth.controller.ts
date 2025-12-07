import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseInterface } from 'src/domain/interfaces/APIResponse.interface';
import { AuthService } from 'src/application/services/auth.service';
import { CreateUserLoginDto } from '../dtos/user/userLoginCreate.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiBody({ type: CreateUserLoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Email ou senha não fornecidos' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async signIn(@Body("data") signInDto: CreateUserLoginDto, @Res({ passthrough: true }) res: Response): Promise<ApiResponseInterface> {
    try {
      if(!signInDto.email || !signInDto.password){
        return {
          status: 400,
          message: 'Email ou senha não fornecidos!',
        };
      }

      const result = await this.authService.signIn(signInDto.email, signInDto.password, res);

      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 401,
        message: `Credenciais inválidas. (controller): ${error.message}`,
      });
    }
  }
  
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renova o access token usando o refresh token' })
  @ApiResponse({ status: 200, description: 'Token renovado com sucesso' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponseInterface> {
    try {
      const refreshToken = req.cookies?.refresh_token;
      
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token não fornecido');
      }

      const result = await this.authService.refreshToken(refreshToken, res);
      return result;
    } catch (error) {
      throw new UnauthorizedException({
        status: 401,
        message: `Erro ao renovar token: ${error.message}`,
      });
    }
  }

  @Post('google')
  async googleAuth(@Body('idToken') idToken: string, @Res({ passthrough: true }) res: Response): Promise<ApiResponseInterface> {
    try {
      if (!idToken) {
        return {
          status: 400,
          message: 'Token do Google não fornecido!',
        };
      }

      const result = await this.authService.googleAuth(idToken, res);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 401,
        message: `Falha na autenticação com o Google. (controller): ${error.message}`,
      });
    }
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body('newPassword') newPassword: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponseInterface> {
    try {
      const result = await this.authService.changePassword(newPassword, req);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao alterar a senha. (controller): ${error.message}`,
      });
    }
  }

  @Get('qrcode/totp')
  @UseGuards(AuthGuard)
  async generateTotpQRCode(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ApiResponseInterface> {
    try {
      const result = await this.authService.generateTotpQRCode(req);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao gerar QR Code TOTP. (controller): ${error.message}`,
      });
    }
  }

  @Post('generate/mfa')
  @UseGuards(AuthGuard)
  async generateMfaCode(@Req() req: Request,@Body('typeCanal') typeCanal: string): Promise<ApiResponseInterface> {
    try {
      const result = await this.authService.generateMfaCode(req, typeCanal);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao gerar código MFA. (controller): ${error.message}`,
      });
    }
  }

  @Post('disable-2fa')
  @UseGuards(AuthGuard)
  async disableTwoFactorAuth(@Req() req: Request): Promise<ApiResponseInterface> {
    try {
      const result = await this.authService.disableTwoFactorAuth(req);
      return result;
    }
    catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao desabilitar 2FA. (controller): ${error.message}`,
      });
    }
  }

  @Post('validate/totp')
  @UseGuards(AuthGuard)
  async validateTotpCode(@Req() req: Request, @Body('code') code: string): Promise<ApiResponseInterface> {
    try {
      const result = await this.authService.validateTotpCode(req, code);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; 
      }
      throw new BadRequestException({
        status: 400,
        message: `Erro ao validar QR Code TOTP. (controller): ${error.message}`,
      });
    }
  }

  @Post('validate/mfa')
  @UseGuards(AuthGuard)
  async validateMfaCode(@Req() req: Request, @Body('code') code: string, @Body('typeCanal') typeCanal: string): Promise<ApiResponseInterface> {
    try {
      const result = await this.authService.validateMfaCode(req, code, typeCanal);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; 
      }
      throw new BadRequestException({
        status: 400,
        message: `Erro ao validar QR Code TOTP. (controller): ${error.message}`,
      });
    }
  }

  @Get('settings')
  @UseGuards(AuthGuard)
  async getUserSettings(
    @Req() req: Request,
    @Query('type') type: string
  ): Promise<ApiResponseInterface> {
    try {
      const result = await this.authService.getUserSettings(req, type);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao obter configurações do usuário. (controller): ${error.message}`,
      });
    }
  }

  @Post('generate/code-password')
  async generateCodePassword(@Body('typeCanal') typeCanal: string, @Body('data') data: string): Promise<ApiResponseInterface> {
    try {
      const result = await this.authService.generateCodePassword(typeCanal, data);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao gerar código MFA. (controller): ${error.message}`,
      });
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retorna informações do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getMe(@Req() req: Request): Promise<ApiResponseInterface> {
    try {
      const user = req['user']; // Dados do token JWT injetados pelo AuthGuard
      
      if (!user) {
        throw new UnauthorizedException('Usuário não autenticado');
      }

      return {
        status: 200,
        message: 'Usuário autenticado',
        user: {
          id: user.id || user.sub,
          nickname: user.nickname,
          email: user.email || user.firstemail,
          role: user.role,
        }
      };
    } catch (error) {
      throw new UnauthorizedException({
        status: 401,
        message: `Não autenticado. (controller): ${error.message}`,
      });
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout do usuário' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async logout(@Res({ passthrough: true }) res: Response): Promise<ApiResponseInterface> {
    try {
      const result = await this.authService.signOut(res);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao fazer logout. (controller): ${error.message}`,
      });
    }
  }

}

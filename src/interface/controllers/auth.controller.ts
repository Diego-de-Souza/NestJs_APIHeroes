import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Inject, Logger, Param, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import { SignInResponse, SignOutResponse } from '../../domain/interfaces/auth.interface';
import { CreateUserLoginDto } from '../dtos/user/userLoginCreate.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';
import type { IAuthPort } from '../../application/ports/in/auth/auth.port';
import { ForgotPasswordDto } from '../dtos/auth/forgot-password.dto';
import type{ IForgotPasswordPort } from '../../application/ports/in/auth/forgot-password.port';
import { ChangePasswordDto } from '../dtos/auth/change-password.dto';
import type { IChangePasswordPort } from '../../application/ports/in/auth/change-password.port';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject('IAuthPort') private readonly authPort: IAuthPort,
    @Inject('IForgotPasswordPort') private readonly forgotPasswordPort: IForgotPasswordPort,
    @Inject('IChangePasswordPort') private readonly changePasswordPort: IChangePasswordPort
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiBody({ type: CreateUserLoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Email ou senha não fornecidos' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async signIn(@Body() body: Record<string, any>, @Req() req: Request): Promise<ApiResponseInterface> {
    try {
      // Aceita body em { data: { email, password } } ou { email, password } na raiz (formato do front)
      const data = body?.data ?? body;
      const email = data?.email?.trim?.() ?? data?.email;
      const password = data?.password;

      if (!email || !password) {
        return {
          status: 400,
          message: 'Email ou senha não fornecidos!',
        };
      }

      const result = await this.authPort.signIn(email, password, req);
      return result as ApiResponseInterface;
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

      const result = await this.authPort.refreshToken(refreshToken, res);
      return result as ApiResponseInterface;
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

      const result = await this.authPort.googleAuth(idToken, res);
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
      const result = await this.authPort.changePassword(newPassword, req);
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
      const result = await this.authPort.generateTotpQRCode(req);
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
      const result = await this.authPort.generateMfaCode(req, typeCanal);
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
      const result = await this.authPort.disableTwoFactorAuth(req);
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
      const result = await this.authPort.validateTotpCode(req, code);
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
      const result = await this.authPort.validateMfaCode(req, code, typeCanal);
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
      const result = await this.authPort.getUserSettings(req, type);
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
      const result = await this.authPort.generateCodePassword(typeCanal, data);
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
  async getMe(@Req() req: Request): Promise<SignInResponse> {
    try {
      const user = req['user'];
      const sessionToken = req.headers['x-session-token'] || 
                        req.query.session_token || 
                        req.body.session_token;
      
      if (!user) {
        throw new UnauthorizedException('Usuário não autenticado');
      }

      return {
        message: 'Usuário autenticado com sucesso',
        has_totp: false,
        session_token: sessionToken,
        user: {
          id: user.id || user.sub,
          nickname: user.nickname,
          email: user.email || user.firstemail,
          role: user.role
        }
      };
    } catch (error) {
      throw new UnauthorizedException({
        status: 401,
        message: `Não autenticado: ${error.message}`,
      });
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout do usuário' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async logout(@Req() req: Request): Promise<SignOutResponse> {
    try {
      const result = await this.authPort.signOut(req);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao fazer logout. (controller): ${error.message}`,
      });
    }
  }

  @Post('logout-session')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout apenas da sessão atual' })
  @ApiResponse({ status: 200, description: 'Logout da sessão realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async logoutCurrentSession(@Req() req: Request): Promise<SignOutResponse> {
    try{
      const result = await this.authPort.signOutCurrentSession(req);
      return result;
    }catch(error){
      throw new BadRequestException({
        status: 400,
        message: `Erro ao fazer logout. (controller): ${error.message}`,
      });
    }
  }

  @Post('logout-session/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout apenas da sessão atual' })
  @ApiResponse({ status: 200, description: 'Logout da sessão realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async logoutCurrentSessionById(@Param('id') id: string, @Req() req: Request): Promise<SignOutResponse> {
    try{
      const result = await this.authPort.signOutCurrentSessionById(id, req);
      return result;
    }catch(error){
      throw new BadRequestException({
        status: 400,
        message: `Erro ao fazer logout. (controller): ${error.message}`,
      });
    }
  }

  @Get('active-sessions')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtém todas as sessões ativas do usuário' })
  @ApiResponse({ status: 200, description: 'Sessões ativas obtidas com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getActiveSessions(@Req() req: Request): Promise<ApiResponseInterface> {
    try {
      const user = req['user'];
      const currentSessionToken = req.headers['x-session-token'] as string;
      
      if (!user) {
        throw new UnauthorizedException('Usuário não autenticado');
      }

      const userId = user.id || user.sub || user.userId;
      
      this.logger.debug('🔍 User object:', user);
      this.logger.debug('🔍 User ID encontrado:', userId);
      
      if (!userId) {
        throw new Error('ID do usuário não encontrado no token JWT');
      }

      const result = await this.authPort.getActiveSessions(userId, currentSessionToken);
      return result as ApiResponseInterface;
    } catch (error) {
      this.logger.error('❌ Erro no controller getActiveSessions:', error);
      throw new BadRequestException({
        status: 400,
        message: `Erro ao obter sessões ativas. (controller): ${error.message}`,
      });
    }
  }

  @Post('register-acesso-user')
  @ApiOperation({ summary: 'Registra acesso à página home (com controle de duplicatas)' })
  @ApiResponse({ status: 200, description: 'Acesso registrado ou já foi registrado recentemente' })
  async registerAcessoUser(@Req() req: Request): Promise<ApiResponseInterface<{ registered: boolean; message: string }>> {
    try {
      const result = await this.authPort.registerAcessoUser(req);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao registrar acesso do usuário. (controller): ${error.message}`,
      });
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Esqueceu a senha? (Recuperação de senha)' })
  @ApiResponse({ status: 200, description: 'Senha recuperada com sucesso' })
  @ApiResponse({ status: 400, description: 'Email não encontrado' })
  @ApiResponse({ status: 401, description: 'Email não fornecido' })
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<ApiResponseInterface> {
    try {
      const result = await this.forgotPasswordPort.execute(body);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao recuperar a senha. (controller): ${error.message}`,
      });
    }
  }

  @Post('change-password-client')
  @ApiOperation({ summary: 'Altera a senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao alterar a senha' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiBody({ type: ChangePasswordDto })
  async changePasswordClient( @Body() body: ChangePasswordDto ): Promise<ApiResponseInterface> {
    try {
      const result = await this.changePasswordPort.execute(body.newPassword, body.id);
      return result;
    } catch (error) {
      throw new BadRequestException({
        status: 400,
        message: `Erro ao alterar a senha. (controller): ${error.message}`,
      });
    }
  }
}

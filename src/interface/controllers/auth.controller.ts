import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
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
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      return await this.authService.findAccessToken(req, res);
    } catch (error) {
      console.error('Erro ao processar o refresh token:', error);
      throw new UnauthorizedException('Não foi possível processar o refresh token.');
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
}

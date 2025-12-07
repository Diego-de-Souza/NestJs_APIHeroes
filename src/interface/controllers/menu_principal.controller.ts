import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuPrincipalService } from '../../application/services/menu-principal.service';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';

@Controller('menu_principal')
export class MenuPrincipalController {
  constructor(private readonly menuPrincipalService: MenuPrincipalService) {}

  @Get('getAll')
  @ApiOperation({ summary: 'BUsca de dados para menu principal' })
  @ApiResponse({ status: 201, description: 'Dados encontrados com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao buscar dados do menu principal' })
  async getDadosMenu(): Promise<ApiResponseInterface<any>>  {
    try {
      const result = await this.menuPrincipalService.findData();
      return result
    }catch(err){
      return {
        status: 500,
        message: 'Erro inesperado ao registrar estúdio.',
        error: err.message || err,
      };
    }
  }

}

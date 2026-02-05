import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import type { IFindMenuDataPort } from '../../application/ports/in/menu-principal/find-menu-data.port';

@Controller('menu_principal')
export class MenuPrincipalController {
  constructor(
    @Inject('IFindMenuDataPort') private readonly findMenuDataPort: IFindMenuDataPort
  ) {}

  @Get('getAll')
  @ApiOperation({ summary: 'Busca de dados para menu principal' })
  @ApiResponse({ status: 201, description: 'Dados encontrados com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao buscar dados do menu principal' })
  async getDadosMenu(): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findMenuDataPort.execute();
    } catch (err: unknown) {
      const e = err as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar dados do menu principal.',
        error: (e?.message ?? String(err)),
      };
    }
  }
}

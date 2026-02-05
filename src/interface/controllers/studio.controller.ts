import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Inject } from '@nestjs/common';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { CreateStudioDto } from '../dtos/studio/create-studio.dto';
import type { ICreateStudioPort } from '../../application/ports/in/studio/create-studio.port';
import type { IFindAllStudioPort } from '../../application/ports/in/studio/find-all-studio.port';
import type { IFindStudioByIdPort } from '../../application/ports/in/studio/find-studio-by-id.port';
import type { IDeleteStudioPort } from '../../application/ports/in/studio/delete-studio.port';
import type { IUpdateStudioPort } from '../../application/ports/in/studio/update-studio.port';

@ApiTags('Studio')
@Controller('studio')
export class StudioController {
  constructor(
    @Inject('ICreateStudioPort') private readonly createStudioPort: ICreateStudioPort,
    @Inject('IFindAllStudioPort') private readonly findAllStudioPort: IFindAllStudioPort,
    @Inject('IFindStudioByIdPort') private readonly findStudioByIdPort: IFindStudioByIdPort,
    @Inject('IDeleteStudioPort') private readonly deleteStudioPort: IDeleteStudioPort,
    @Inject('IUpdateStudioPort') private readonly updateStudioPort: IUpdateStudioPort,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo estúdio' })
  @ApiResponse({ status: 201, description: 'Estúdio criado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao registrar estúdio' })
  async registro(@Body() studioDto: CreateStudioDto): Promise<ApiResponseInterface<CreateStudioDto>> {
    try {
      return await this.createStudioPort.execute(studioDto);
    } catch (error) {
      return {
        status: 500,
        message: 'Erro inesperado ao registrar estúdio.',
        error: error.message || error,
      };
    }
  }

  @Get('find-all-studio')
  @ApiOperation({ summary: 'Busca todos os estúdios' })
  @ApiResponse({ status: 200, description: 'Lista de estúdios retornada com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao buscar estúdio' })
  async findAllStudios(): Promise<ApiResponseInterface<CreateStudioDto>> {
    try {
      return await this.findAllStudioPort.execute();
    } catch (error) {
      return {
        status: 500,
        message: 'Erro inesperado ao buscar estúdio.',
        error: error.message || error,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete-one-studio/:id')
  @ApiOperation({ summary: 'Deleta um estúdio pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do estúdio' })
  @ApiResponse({ status: 200, description: 'Estúdio deletado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao deletar estúdio' })
  async deleteOneStudio(@Param('id') id: string): Promise<ApiResponseInterface<number>> {
    try {
      return await this.deleteStudioPort.execute(id);
    } catch (error) {
      return {
        status: 500,
        message: 'Erro inesperado ao deletar estúdio.',
        error: error.message || error,
      };
    }
  }

  @Get('find-one-studio/:id')
  @ApiOperation({ summary: 'Busca um estúdio pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do estúdio' })
  @ApiResponse({ status: 200, description: 'Estúdio encontrado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao buscar um estúdio' })
  async findOneStudio(@Param('id') id: string): Promise<ApiResponseInterface<CreateStudioDto>> {
    try {
      return await this.findStudioByIdPort.execute(id);
    } catch (error) {
      return {
        status: 500,
        message: 'Erro inesperado ao buscar um estúdio.',
        error: error.message || error,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  @ApiOperation({ summary: 'Atualiza um estúdio pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do estúdio' })
  @ApiResponse({ status: 200, description: 'Estúdio atualizado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao atualizar um estúdio' })
  async updateStudio(@Param('id') id: string, @Body('data') data: CreateStudioDto): Promise<ApiResponseInterface<CreateStudioDto>> {
    try {
      return await this.updateStudioPort.execute(id, data);
    } catch (error) {
      return {
        status: 500,
        message: 'Erro inesperado ao atualizar um estúdio.',
        error: error.message || error,
      };
    }
  }
}

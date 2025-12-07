
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudioService } from '../../application/services/studio.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreateStudioDto } from '../dtos/studio/create-studio.dto';

@ApiTags('Studio')
@Controller('studio')
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo estúdio' })
  @ApiResponse({ status: 201, description: 'Estúdio criado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao registrar estúdio' })
  async registro(@Body() studioDto: CreateStudioDto): Promise<ApiResponseInterface<CreateStudioDto>> {
    try {
      const result = await this.studioService.create(studioDto)
      return result;
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
  async findAllStudios(): Promise<ApiResponseInterface<CreateStudioDto>>{
    try{
      const dadosStudios = await this.studioService.findAllStudio();
      return dadosStudios;
    }catch(error){
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
  async deleteOneStudio(@Param('id') id: number): Promise<ApiResponseInterface<number>>{
    try{
      const isDeleted = await this.studioService.DeleteStudio(id);
      return isDeleted;
    }catch(error){
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
  async findOneStudio(@Param('id') id: number): Promise<ApiResponseInterface<CreateStudioDto>>{
    try{
      const findStudio = await this.studioService.findStudioById(id);
      return findStudio;
    }catch(error){
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
  async updateStudio(@Param('id') id: number, @Body('data') data: CreateStudioDto): Promise<ApiResponseInterface<CreateStudioDto>>{
    try{
      const isUpdate = await this.studioService.updateStudio(id, data);
      return isUpdate;
    }catch(error){
      return {
        status: 500,
        message: 'Erro inesperado ao atualizar um estúdio.',
        error: error.message || error,
      };
    }
  }

}

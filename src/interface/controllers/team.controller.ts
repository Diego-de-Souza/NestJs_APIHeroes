import { Controller, Get, Post, Body, Param, ConflictException, ParseIntPipe, UseGuards, Inject, Put } from '@nestjs/common';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTeamDto } from '../dtos/team/create-team.dto';
import { AuthGuard } from '../guards/auth.guard';
import type { ICreateTeamPort } from '../../application/ports/in/team/create-team.port';
import type { IFindTeamByIdPort } from '../../application/ports/in/team/find-team-by-id.port';
import type { IFindAllTeamPort } from '../../application/ports/in/team/find-all-team.port';
import type { IUpdateTeamPort } from '../../application/ports/in/team/update-team.port';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(
    @Inject('ICreateTeamPort') private readonly createTeamPort: ICreateTeamPort,
    @Inject('IFindTeamByIdPort') private readonly findTeamByIdPort: IFindTeamByIdPort,
    @Inject('IFindAllTeamPort') private readonly findAllTeamPort: IFindAllTeamPort,
    @Inject('IUpdateTeamPort') private readonly updateTeamPort: IUpdateTeamPort,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria uma nova equipe' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({ status: 201, description: 'Equipe criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Equipe com este nome já existe' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao registrar equipe' })
  async registro(@Body('data') teamDTO: CreateTeamDto): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.createTeamPort.execute(teamDTO);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Equipe com este nome já existe');
      }
      throw error;
    }
  }

  @Get('find-one-team/:id')
  @ApiOperation({ summary: 'Busca uma equipe pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da equipe' })
  @ApiResponse({ status: 200, description: 'Equipe encontrada com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao buscar uma equipe' })
  async getEquipe(@Param('id') id: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findTeamByIdPort.execute(id);
    } catch (error) {
      return {
        status: 500,
        message: 'Erro inesperado ao buscar um estúdio.',
        error: (error as Error).message || error,
      };
    }
  }

  @Get('find-all-team')
  @ApiOperation({ summary: 'Busca todas as equipes' })
  @ApiResponse({ status: 200, description: 'Lista de equipes retornada com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao buscar equipes' })
  async getAllEquipe(): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findAllTeamPort.execute();
    } catch (error) {
      return {
        status: 500,
        message: 'Erro inesperado ao buscar estúdio.',
        error: (error as Error).message || error,
      };
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Atualiza uma equipe pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da equipe' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({ status: 200, description: 'Equipe atualizada com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao atualizar equipe' })
  async updateTeam(@Param('id') id: string, @Body('data') teamDTO: CreateTeamDto): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.updateTeamPort.execute(id, teamDTO);
    } catch (error) {
      return {
        status: 500,
        message: 'Erro inesperado ao atualizar equipe.',
        error: (error as Error).message || error,
      };
    }
  }
}

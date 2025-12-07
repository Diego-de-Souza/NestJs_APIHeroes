import { Controller, Get, Post, Body, Param, ConflictException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamService } from '../../application/services/team.service';
import { CreateTeamDto } from '../dtos/team/create-team.dto';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria uma nova equipe' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({ status: 201, description: 'Equipe criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Equipe com este nome já existe' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao registrar equipe' })
  async registro(@Body("data") teamDTO: CreateTeamDto): Promise<any>{
    try{
      const result = await this.teamService.create(teamDTO);
      return result;
    }catch (error){
      if(error instanceof ConflictException){
        throw new ConflictException('Equipe com este nome já existe');
      }
      throw error;
    }
  }  

  @Get('find-one-studio/:id')
  @ApiOperation({ summary: 'Busca uma equipe pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da equipe' })
  @ApiResponse({ status: 200, description: 'Equipe encontrada com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao buscar uma equipe' })
  async getEquipe(@Param("id", ParseIntPipe) id: number): Promise<ApiResponseInterface>{
    try{
      const result = await this.teamService.findTeamById(id);

      return result;
    }catch(error){
      return {
        status: 500,
        message: 'Erro inesperado ao buscar um estúdio.',
        error: error.message || error,
      };
    }
  }
  
  @Get('find-all-team')
  @ApiOperation({ summary: 'Busca todas as equipes' })
  @ApiResponse({ status: 200, description: 'Lista de equipes retornada com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro inesperado ao buscar equipes' })
  async getAllEquipe(){
    try{
      const result = await this.teamService.findAllTeam();
      return result
    }catch(error){
      return {
        status: 500,
        message: 'Erro inesperado ao buscar estúdio.',
        error: error.message || error,
      };
    }
  }
}

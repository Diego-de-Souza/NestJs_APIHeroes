import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  ParseIntPipe,
  Param,
  Put,
  Delete,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { CreateDadosHeroisDto } from '../dtos/dados-herois/create-dados-herois.dto';
import { LogInterceptor } from '../../shared/interceptors/LogInterceptor';
import { UpdateDadosHeroisDto } from '../dtos/dados-herois/update-dados-herois.dto';
import type { Express } from 'express';
import type { ICreateHeroesPort } from '../../application/ports/in/heroes/create-heroes.port';
import type { IFindAllHeroesPort } from '../../application/ports/in/heroes/find-all-heroes.port';
import type { IFindHeroesByIdPort } from '../../application/ports/in/heroes/find-heroes-by-id.port';
import type { IUpdateHeroesPort } from '../../application/ports/in/heroes/update-heroes.port';
import type { IDeleteHeroesPort } from '../../application/ports/in/heroes/delete-heroes.port';
import type { IFindHeroesByStudioPort } from '../../application/ports/in/heroes/find-heroes-by-studio.port';
import type { IFindHeroesByTeamPort } from '../../application/ports/in/heroes/find-heroes-by-team.port';
import type { IFindHeroesByReleaseYearPort } from '../../application/ports/in/heroes/find-heroes-by-release-year.port';
import type { IFindHeroesByMoralityPort } from '../../application/ports/in/heroes/find-heroes-by-morality.port';
import type { IFindHeroesByGenrePort } from '../../application/ports/in/heroes/find-heroes-by-genre.port';

@ApiTags('Herois')
@Controller('herois')
export class DadosHeroisController {
  constructor(
    @Inject('ICreateHeroesPort') private readonly createHeroesPort: ICreateHeroesPort,
    @Inject('IFindAllHeroesPort') private readonly findAllHeroesPort: IFindAllHeroesPort,
    @Inject('IFindHeroesByIdPort') private readonly findHeroesByIdPort: IFindHeroesByIdPort,
    @Inject('IUpdateHeroesPort') private readonly updateHeroesPort: IUpdateHeroesPort,
    @Inject('IDeleteHeroesPort') private readonly deleteHeroesPort: IDeleteHeroesPort,
    @Inject('IFindHeroesByStudioPort') private readonly findHeroesByStudioPort: IFindHeroesByStudioPort,
    @Inject('IFindHeroesByTeamPort') private readonly findHeroesByTeamPort: IFindHeroesByTeamPort,
    @Inject('IFindHeroesByReleaseYearPort') private readonly findHeroesByReleaseYearPort: IFindHeroesByReleaseYearPort,
    @Inject('IFindHeroesByMoralityPort') private readonly findHeroesByMoralityPort: IFindHeroesByMoralityPort,
    @Inject('IFindHeroesByGenrePort') private readonly findHeroesByGenrePort: IFindHeroesByGenrePort,
  ) {}

  @UseGuards(AuthGuard)
  @ApiTags('Herois')
  @ApiOperation({ summary: 'Cria um novo herói' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados para criar herói + imagens',
    schema: {
      type: 'object',
      properties: {
        imagens: { type: 'array', items: { type: 'string', format: 'binary' } },
        nome: { type: 'string' },
        poder: { type: 'string' },
        idade: { type: 'integer' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Herói criado com sucesso' })
  @UseInterceptors(FilesInterceptor('imagens'), LogInterceptor)
  @Post()
  async insere(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('data') createDadosHeroisDto: CreateDadosHeroisDto,
  ): Promise<ApiResponseInterface<unknown>> {
    try {
      if (files?.length > 0) {
        createDadosHeroisDto.image1 = files[0]?.buffer ?? null;
        createDadosHeroisDto.image2 = files[1]?.buffer ?? null;
      }
      return await this.createHeroesPort.execute(createDadosHeroisDto);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao criar herói.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @ApiTags('Herois')
  @ApiOperation({ summary: 'Busca todos os heróis' })
  @ApiResponse({ status: 200, description: 'Lista de heróis' })
  @Get('find-all-heroes')
  async getHeroesAllHeroes(): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findAllHeroesPort.execute();
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @ApiTags('Herois')
  @ApiOperation({ summary: 'Busca herói pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do herói' })
  @ApiResponse({ status: 200, description: 'Herói encontrado' })
  @Get('find-one-hero/:id')
  async getHeroById(@Param('id') id: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findHeroesByIdPort.execute(id);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @UseGuards(AuthGuard)
  @ApiTags('Herois')
  @ApiOperation({ summary: 'Atualiza um herói existente' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados para atualizar herói + imagens',
    schema: {
      type: 'object',
      properties: {
        imagens: { type: 'array', items: { type: 'string', format: 'binary' } },
        nome: { type: 'string' },
        poder: { type: 'string' },
        idade: { type: 'integer' },
      },
    },
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do herói a ser atualizado' })
  @ApiResponse({ status: 200, description: 'Herói atualizado com sucesso' })
  @UseInterceptors(FilesInterceptor('imagens'), LogInterceptor)
  @Put('Update/:id')
  async Upadate(
    @Param('id') id: string,
    @Body('data') updateDadosHeroisDto: UpdateDadosHeroisDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ApiResponseInterface<unknown>> {
    try {
      if (files?.length > 0) {
        updateDadosHeroisDto.image1 = files[0]?.buffer ?? null;
        updateDadosHeroisDto.image2 = files[1]?.buffer ?? null;
      }
      return await this.updateHeroesPort.execute(id, updateDadosHeroisDto);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @UseGuards(AuthGuard)
  @ApiTags('Herois')
  @ApiOperation({ summary: 'Remove herói pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do herói a ser removido' })
  @ApiResponse({ status: 200, description: 'Herói removido' })
  @Delete('delete/:id')
  async Delete(@Param('id') id: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.deleteHeroesPort.execute(id);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao remover herói.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @ApiTags('Get Heroes by Studio')
  @ApiOperation({ summary: 'Busca heróis por estúdio' })
  @ApiParam({ name: 'studioId', type: Number, description: 'ID do estúdio' })
  @ApiResponse({ status: 200, description: 'Lista de heróis do estúdio' })
  @Get('editora/:studioId')
  async findHeroesByStudio(@Param('studioId') studioId: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findHeroesByStudioPort.execute(studioId);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar heróis por estúdio.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @ApiTags('Get Heroes by Team')
  @ApiOperation({ summary: 'Busca heróis por Team' })
  @ApiParam({ name: 'name', type: String, description: 'Nome do Team' })
  @ApiResponse({ status: 200, description: 'Lista de heróis do Team' })
  @Get('team/:name')
  async findHeroesByTeam(@Param('name') teamName: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findHeroesByTeamPort.execute(teamName);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar heróis por team.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @ApiTags('Get Heroes by Release Year')
  @ApiOperation({ summary: 'Busca heróis por ano de lançamento' })
  @ApiParam({ name: 'anoLancamento', type: Number, description: 'Ano de lançamento' })
  @ApiResponse({ status: 200, description: 'Lista de heróis do ano de lançamento' })
  @Get('ano_lancamento/:anoLancamento')
  async findHeroesByReleaseYear(
    @Param('anoLancamento', ParseIntPipe) anoLancamento: number,
  ): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findHeroesByReleaseYearPort.execute(anoLancamento);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar heróis por ano de lançamento.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @ApiTags('Get Heroes by Morality')
  @ApiOperation({ summary: 'Busca heróis por moralidade' })
  @ApiParam({ name: 'morality', type: String, description: 'Moralidade do herói (herói/vilão)' })
  @ApiResponse({ status: 200, description: 'Lista de heróis pela moralidade' })
  @Get('morality/:morality')
  async findHeroesByMorality(@Param('morality') morality: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findHeroesByMoralityPort.execute(morality);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar heróis por moralidade.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @ApiTags('Get Heroes by Genre')
  @ApiOperation({ summary: 'Busca heróis por gênero' })
  @ApiParam({ name: 'genre', type: String, description: 'Gênero do herói' })
  @ApiResponse({ status: 200, description: 'Lista de heróis pelo gênero' })
  @Get('genre/:genre')
  async findHeroesByGenre(@Param('genre') genre: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findHeroesByGenrePort.execute(genre);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar heróis por gênero.',
        error: (err?.message ?? String(error)),
      };
    }
  }
}

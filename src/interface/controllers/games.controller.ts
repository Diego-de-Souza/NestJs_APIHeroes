import { Body, Controller, Delete, Get, Param, Post, Put, Query, Inject } from "@nestjs/common";
import { ImageApiService } from "../../application/services/image-api.service";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import type { ICreateGamePort } from "../../application/ports/in/games/create-game.port";
import type { IUpdateGamePort } from "../../application/ports/in/games/update-game.port";
import type { IDeleteGamePort } from "../../application/ports/in/games/delete-game.port";
import type { IFindAllGamesPort } from "../../application/ports/in/games/find-all-games.port";
import type { IFindDataMemoryGamePort } from "../../application/ports/in/games/find-data-memory-game.port";
import type { IGetUserGameProgressPort } from "../../application/ports/in/games/get-user-progress.port";
import type { ISaveUserGameProgressPort } from "../../application/ports/in/games/save-user-game-progress.port";

@Controller('games')
export class GamesController {
  constructor(
    @Inject('ICreateGamePort') private readonly createGamePort: ICreateGamePort,
    @Inject('IUpdateGamePort') private readonly updateGamePort: IUpdateGamePort,
    @Inject('IDeleteGamePort') private readonly deleteGamePort: IDeleteGamePort,
    @Inject('IFindAllGamesPort') private readonly findAllGamesPort: IFindAllGamesPort,
    @Inject('IFindDataMemoryGamePort') private readonly findDataMemoryGamePort: IFindDataMemoryGamePort,
    @Inject('IGetUserGameProgressPort') private readonly getUserGameProgressPort: IGetUserGameProgressPort,
    @Inject('ISaveUserGameProgressPort') private readonly saveUserGameProgressPort: ISaveUserGameProgressPort,
    private readonly imageApiService: ImageApiService,
  ) {}

  @Post('')
  async createGame(@Body() gameData: Record<string, unknown>): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.createGamePort.execute(gameData);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao criar jogo.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Put(':id')
  async updateGame(@Body() gameData: Record<string, unknown>, @Param('id') id: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.updateGamePort.execute(id, gameData);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao atualizar jogo.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Delete(':id')
  async deleteGame(@Param('id') id: string): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.deleteGamePort.execute(id);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao deletar jogo.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Get('list-games')
  async listGames(): Promise<ApiResponseInterface<unknown>> {
    try {
      return await this.findAllGamesPort.execute();
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar lista de jogos.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Post('memory-game')
  async getDataMemoryGame(@Body() payload: Record<string, unknown>): Promise<ApiResponseInterface<unknown>> {
    if (!payload) {
      return {
        status: 400,
        message: 'Payload não fornecido.',
      };
    }
    try {
      return await this.findDataMemoryGamePort.execute(payload);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar dados do jogo.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Get('cards')
  async getCards(@Query('level') level: number, @Query('theme') theme: string) {
    const count = this.getCountByLevel(level);
    return await this.imageApiService.fetchImages(theme, count);
  }

  @Get('themes')
  async getThemes() {
    return await this.imageApiService.listThemes();
  }

  @Get('status')
  async getStatus() {
    return await this.imageApiService.getApiStatus();
  }

  private getCountByLevel(level: number): number {
    return 3 + (level - 1) * 5;
  }

  @Get('user-game-progress')
  async getUserGameProgress(
    @Query('userId') userId: string,
    @Query('gameId') gameId: string,
  ) {
    return this.getUserGameProgressPort.execute(userId, gameId);
  }

  @Post('user-game-progress')
  async saveUserGameProgress(@Body() body: {
    user_id: string;
    game_id: string;
    lvl_user: number;
    score: number;
    attempts: number;
    metadata: Record<string, unknown>;
  }) {
    return this.saveUserGameProgressPort.execute(body);
  }
}

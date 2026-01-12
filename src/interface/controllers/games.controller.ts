import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { GamesService } from "../../application/services/games.service";
import { ImageApiService } from "../../application/services/image-api.service";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";

@Controller('games')
export class GamesController {

    constructor(
        private readonly gamesService: GamesService,
        private readonly imageApiService: ImageApiService,
    ) {}

    @Post('')
    async createGame(@Body() gameData: any): Promise<ApiResponseInterface> {
        try{
            const result = await this.gamesService.createGame(gameData);
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao criar jogo.',
                error: error.message || error,
            };
        }
    }

    @Put(':id')
    async updateGame(@Body() gameData: any, @Param('id') id: number): Promise<ApiResponseInterface> {
        try{
            const result = await this.gamesService.updateGame(id, gameData);
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao atualizar jogo.',
                error: error.message || error,
            };
        }
    }

    @Delete(':id')
    async deleteGame(@Param('id') id: number): Promise<ApiResponseInterface> {
        try{
            const result = await this.gamesService.deleteGame(id);
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar jogo.',
                error: error.message || error,
            };
        }
    }

    @Get('list-games')
    async listGames(): Promise<ApiResponseInterface> {
        try{
            const result = await this.gamesService.listGames();
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar lista de jogos.',
                error: error.message || error,
            };
        }
    }

    @Post('memory-game')
    async getDataMemoryGame(@Body() payload: any): Promise<ApiResponseInterface> {
        if(!payload){
            return {
                status: 400,
                message: 'Payload não fornecido.'
            };   
        }
        try{
            const result = await this.gamesService.getDataMemoryGame(payload);
            return result;  
        } catch (error) {
            return {
            status: 500,
            message: 'Erro inesperado ao atualizar um estúdio.',
            error: error.message || error,
            };      
        }
    }

    @Get('cards')
    async getCards(@Query('level') level: number, @Query('theme') theme: string) {
        // Defina quantidade por nível
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
        // Implemente lógica de quantidade de imagens por nível
        return 3 + (level - 1) * 5;
    }

    @Get('user-game-progress')
    async getUserGameProgress(
        @Query('userId') userId: number,
        @Query('gameId') gameId: number,
    ) {
        return this.gamesService.getUserGameProgress(userId, gameId);
    }

  @Post('user-game-progress')
  async saveUserGameProgress(@Body() body: {
    user_id: number;
    game_id: number;
    lvl_user: number;
    score: number;
    attempts: number;
    metadata: Record<string, any>;
  }) {
    return this.gamesService.createUserGameProgress(body);
  }
}

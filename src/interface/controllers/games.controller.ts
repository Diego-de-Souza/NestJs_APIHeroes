import { Body, Controller, Post } from "@nestjs/common";
import { GamesService } from "src/application/services/games.service";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";

@Controller('games')
export class GamesController {

    constructor(private readonly gamesService: GamesService) {}

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
}
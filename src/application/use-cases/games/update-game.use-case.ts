import { Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { GamesRepository } from "src/infrastructure/repositories/games.repository";


@Injectable()
export class UpdateGameUseCase {
    private readonly logger = new Logger(UpdateGameUseCase.name);
    constructor(
        private readonly gamesRepository: GamesRepository
    ){}
    
    async updateGame(id: number, gameData: any): Promise<ApiResponseInterface>{
        try{
            const gameExist = await this.gamesRepository.findGameById(id);
            
            if(!gameExist){
                return {
                    status: 404,
                    message: 'Jogo não encontrado.',
                };
            }

            const dataGame ={
                name: gameData.name,
                description: gameData.description,
                type: gameData.type,
                link: gameData.link
            }

            const game = await this.gamesRepository.updateGame(id, dataGame);

            return {
                status: 200,
                message: 'Jogo atualizado com sucesso.',
                dataUnit: game,
            };
        }catch(error){
            this.logger.error('Erro ao atualizar jogo:', error);
            return {
                status: 500,
                message: 'Erro inesperado ao atualizar jogo.',
                error: error.message || error,
            };
        }
    }
}
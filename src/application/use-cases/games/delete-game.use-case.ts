import { Injectable, Logger } from "@nestjs/common";
import { ImageService } from "src/application/services/image.service";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { GamesRepository } from "src/infrastructure/repositories/games.repository";


@Injectable()
export class DeleteGameUseCase {
    private readonly logger = new Logger(DeleteGameUseCase.name);
    
    constructor(
        private readonly gamesRepository: GamesRepository,
        private readonly imageService: ImageService
    ){}

    async deleteGame(id: number): Promise<ApiResponseInterface>{
        try{
            const game = await this.gamesRepository.findGameById(id);

            if(!game){
                return {
                    status: 404,
                    message: 'Jogo não encontrado.',
                };
            }

            if(game.url_icon){
                await this.imageService.deleteImage(game.url_icon);
            }
            
            await this.gamesRepository.deleteGame(id);

            return {
                status: 200,
                message: 'Jogo deletado com sucesso.',
            };
        }catch(error){
            this.logger.error('Erro ao deletar jogo:', error);
            return {
                status: 500,
                message: 'Erro inesperado ao deletar jogo.',
                error: error.message || error,
            };
        }
    }
}
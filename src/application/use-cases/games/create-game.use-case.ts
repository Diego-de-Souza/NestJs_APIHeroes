import { Injectable, Logger } from "@nestjs/common";
import { ImageService } from "../../services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { GamesRepository } from "../../../infrastructure/repositories/games.repository";

@Injectable()
export class CreateGameUseCase {
    private readonly logger = new Logger(CreateGameUseCase.name);
    constructor(
        private readonly gamesRepository: GamesRepository,
        private readonly imageService: ImageService
    ){}

    async createGame(gameData: any): Promise<ApiResponseInterface>{
        try{
            const imageUploadResult = await this.imageService.saveImageBase64(gameData.icon, gameData.image_name, 'games');
            
            const dataGame ={
                name: gameData.name,
                description: gameData.description,
                type: gameData.type,
                link: gameData.link,
                url_icon: imageUploadResult,
            }

            const game = await this.gamesRepository.createGame(dataGame);
            
            return {
                status: 201,
                message: 'Jogo criado com sucesso.',
                dataUnit: game,
            };
        }catch(error){
            this.logger.error('Erro ao criar jogo:', error);
            return {
                status: 500,
                message: 'Erro inesperado ao criar jogo.',
                error: error.message || error,
            };
        }
    }
}
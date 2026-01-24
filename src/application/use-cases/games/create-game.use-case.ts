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
            // Valida se o icon foi fornecido (é obrigatório)
            if (!gameData.icon) {
                return {
                    status: 400,
                    message: 'O ícone do jogo é obrigatório.',
                };
            }
            
            let imageUploadResult: string;
            
            // Tenta fazer upload da imagem
            try {
                imageUploadResult = await this.imageService.saveImageBase64(gameData.icon, gameData.image_name, 'games');
                this.logger.log(`Imagem do jogo salva: ${imageUploadResult}`);
                
                // Valida se a URL foi gerada corretamente
                if (!imageUploadResult || imageUploadResult.trim() === '') {
                    return {
                        status: 400,
                        message: 'Falha ao salvar a imagem do jogo. URL da imagem não foi gerada.',
                    };
                }
            } catch (imageError) {
                this.logger.error('Erro ao salvar imagem do jogo:', imageError);
                return {
                    status: 400,
                    message: 'Erro ao fazer upload da imagem do jogo.',
                    error: imageError.message || imageError,
                };
            }
            
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
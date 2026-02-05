import { Injectable, Logger, Inject } from "@nestjs/common";
import { ImageService } from "../../services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IGamesRepository } from "../../ports/out/games.port";
import type { ICreateGamePort } from "../../ports/in/games/create-game.port";

@Injectable()
export class CreateGameUseCase implements ICreateGamePort {
    private readonly logger = new Logger(CreateGameUseCase.name);
    constructor(
        @Inject('IGamesRepository') private readonly gamesRepository: IGamesRepository,
        private readonly imageService: ImageService
    ) {}

    async execute(gameData: Record<string, unknown>): Promise<ApiResponseInterface<unknown>> {
        try{
            // Valida se o icon foi fornecido (é obrigatório)
            if (!gameData.icon) {
                return {
                    status: 400,
                    message: 'O ícone do jogo é obrigatório.',
                };
            }
            
            let imageUploadResult: string;
            const icon = gameData.icon as string;
            const imageName = gameData.image_name as string;
            try {
                imageUploadResult = await this.imageService.saveImageBase64(icon, imageName, 'games');
                this.logger.log(`Imagem do jogo salva: ${imageUploadResult}`);
                
                // Valida se a URL foi gerada corretamente
                if (!imageUploadResult || imageUploadResult.trim() === '') {
                    return {
                        status: 400,
                        message: 'Falha ao salvar a imagem do jogo. URL da imagem não foi gerada.',
                    };
                }
            } catch (imageError: unknown) {
                const err = imageError as Error;
                this.logger.error('Erro ao salvar imagem do jogo:', imageError);
                return {
                    status: 400,
                    message: 'Erro ao fazer upload da imagem do jogo.',
                    error: (err?.message ?? String(imageError)),
                };
            }
            
            const dataGame = {
                name: gameData.name,
                description: gameData.description,
                type: gameData.type,
                link: gameData.link,
                url_icon: imageUploadResult,
            } as Record<string, unknown>;

            const game = await this.gamesRepository.createGame(dataGame);
            
            return {
                status: 201,
                message: 'Jogo criado com sucesso.',
                dataUnit: game,
            };
        } catch (error: unknown) {
            const err = error as Error;
            this.logger.error('Erro ao criar jogo:', error);
            return {
                status: 500,
                message: 'Erro inesperado ao criar jogo.',
                error: (err?.message ?? String(error)),
            };
        }
    }
}
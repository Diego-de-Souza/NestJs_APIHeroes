import { Injectable, Logger, Inject } from "@nestjs/common";
import { ImageService } from "../../../application/services/image.service";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IGamesRepository } from "../../ports/out/games.port";
import type { IDeleteGamePort } from "../../ports/in/games/delete-game.port";

@Injectable()
export class DeleteGameUseCase implements IDeleteGamePort {
    private readonly logger = new Logger(DeleteGameUseCase.name);

    constructor(
        @Inject('IGamesRepository') private readonly gamesRepository: IGamesRepository,
        private readonly imageService: ImageService
    ) {}

    async execute(id: string): Promise<ApiResponseInterface<unknown>> {
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
        } catch (error: unknown) {
            const err = error as Error;
            this.logger.error('Erro ao deletar jogo:', error);
            return {
                status: 500,
                message: 'Erro inesperado ao deletar jogo.',
                error: (err?.message ?? String(error)),
            };
        }
    }
}
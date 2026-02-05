import { BadRequestException, HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { UserGameProcess } from "../../../infrastructure/database/sequelize/models/index.model";
import type { IGamesRepository } from "../../ports/out/games.port";
import type { ISaveUserGameProgressPort } from "../../ports/in/games/save-user-game-progress.port";

@Injectable()
export class SaveUserGameProgressUseCase implements ISaveUserGameProgressPort {
    constructor(
        @Inject('IGamesRepository') private readonly gamesRepository: IGamesRepository
    ) {}

    async execute(data: {
      user_id: string;
      game_id: string;
      lvl_user: number;
      score: number;
      attempts: number;
      metadata: Record<string, unknown>;
    }): Promise<ApiResponseInterface<UserGameProcess | number>> {
      const gameExists = await this.gamesRepository.findGameByPk(data.game_id);
      
      if (!gameExists) {
        throw new BadRequestException(`Jogo com ID ${data.game_id} não existe`);
      }

      const existing = await this.gamesRepository.findOneProcess(data.user_id, data.game_id);

      let result: UserGameProcess;
      
      if (existing) {
        await this.gamesRepository.update({
          lvl_user: data.lvl_user + 1,
          score: data.score,
          attempts: data.attempts,
          last_move_at: new Date(),
          metadata: data.metadata,
        }, data.user_id, data.game_id);

        const updated = await this.gamesRepository.findOneProcess(data.user_id, data.game_id);
        
        if (!updated) {
          throw new BadRequestException('Erro ao buscar progresso atualizado');
        }
        
        result = updated;
      } else {
        result = await this.gamesRepository.create({
          user_id: data.user_id,
          game_id: data.game_id,
          lvl_user: data.lvl_user,
          score: data.score,
          attempts: data.attempts,
          last_move_at: new Date(),
          metadata: data.metadata,
        }) as UserGameProcess;
      }

      return {
        status: HttpStatus.OK,
        message: 'Progresso salvo com sucesso',
        dataUnit: result,
      };
    }
}
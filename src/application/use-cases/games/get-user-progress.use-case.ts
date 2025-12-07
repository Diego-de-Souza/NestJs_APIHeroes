import { Injectable } from '@nestjs/common';
import { ApiResponseInterface } from 'src/domain/interfaces/APIResponse.interface';
import { UserGameProcess } from 'src/infrastructure/database/sequelize/models/index.model';
import { GamesRepository } from 'src/infrastructure/repositories/games.repository';

@Injectable()
export class GetUserProgressUseCase {
  constructor(private readonly gamesRepository: GamesRepository) {}

  async getUserGameProgress(userId: number, gameId: number): Promise<ApiResponseInterface<UserGameProcess | null>> {
    const progress = await this.gamesRepository.findOneProcess(userId, gameId);

    if (!progress) {
      return {
        status: 404,
        message: 'Progresso não encontrado',
        data: null,
      };
    }

    return {
      status: 200,
      message: 'Progresso encontrado com sucesso',
      dataUnit: progress,
    };
  }
}
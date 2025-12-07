import { Injectable } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { UserGameProcess } from '../../../infrastructure/database/sequelize/models/index.model';
import { GamesRepository } from '../../../infrastructure/repositories/games.repository';

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
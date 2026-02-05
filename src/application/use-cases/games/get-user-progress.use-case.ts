import { Injectable, Inject } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { UserGameProcess } from '../../../infrastructure/database/sequelize/models/index.model';
import type { IGamesRepository } from '../../ports/out/games.port';
import type { IGetUserGameProgressPort } from '../../ports/in/games/get-user-progress.port';

@Injectable()
export class GetUserProgressUseCase implements IGetUserGameProgressPort {
  constructor(
    @Inject('IGamesRepository') private readonly gamesRepository: IGamesRepository
  ) {}

  async execute(userId: string, gameId: string): Promise<ApiResponseInterface<UserGameProcess | null>> {
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
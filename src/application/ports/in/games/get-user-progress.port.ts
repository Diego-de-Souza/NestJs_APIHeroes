import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { UserGameProcess } from '../../../../infrastructure/database/sequelize/models/games/user-game-progress.model';

/** Port IN: contrato para buscar progresso do usuário no jogo. Controller → Port → UseCase. */
export interface IGetUserGameProgressPort {
  execute(userId: string, gameId: string): Promise<ApiResponseInterface<UserGameProcess | null>>;
}

import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { UserGameProcess } from '../../../../infrastructure/database/sequelize/models/games/user-game-progress.model';

/** Port IN: contrato para salvar progresso do usuário no jogo. Controller → Port → UseCase. */
export interface ISaveUserGameProgressPort {
  execute(data: {
    user_id: string;
    game_id: string;
    lvl_user: number;
    score: number;
    attempts: number;
    metadata: Record<string, unknown>;
  }): Promise<ApiResponseInterface<UserGameProcess | number>>;
}

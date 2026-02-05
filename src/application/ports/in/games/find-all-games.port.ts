import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Games } from '../../../../infrastructure/database/sequelize/models/games/games.model';

/** Port IN: contrato para listar jogos. Controller → Port → UseCase. */
export interface IFindAllGamesPort {
  execute(): Promise<ApiResponseInterface<Games>>;
}

import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Heroes } from '../../../../infrastructure/database/sequelize/models/heroes.model';

/** Port IN: contrato para buscar heróis por moralidade. Controller → Port → UseCase. */
export interface IFindHeroesByMoralityPort {
  execute(morality: string): Promise<ApiResponseInterface<Heroes>>;
}

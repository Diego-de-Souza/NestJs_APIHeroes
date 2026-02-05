import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Heroes } from '../../../../infrastructure/database/sequelize/models/heroes.model';

/** Port IN: contrato para buscar heróis por ano de lançamento. Controller → Port → UseCase. */
export interface IFindHeroesByReleaseYearPort {
  execute(year: number): Promise<ApiResponseInterface<Heroes>>;
}

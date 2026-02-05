import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Heroes } from '../../../../infrastructure/database/sequelize/models/heroes.model';

/** Port IN: contrato para buscar heróis por gênero. Controller → Port → UseCase. */
export interface IFindHeroesByGenrePort {
  execute(genre: string): Promise<ApiResponseInterface<Heroes>>;
}

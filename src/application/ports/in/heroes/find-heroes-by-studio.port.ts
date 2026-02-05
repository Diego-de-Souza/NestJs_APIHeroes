import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Heroes } from '../../../../infrastructure/database/sequelize/models/heroes.model';

/** Port IN: contrato para buscar heróis por estúdio. Controller → Port → UseCase. */
export interface IFindHeroesByStudioPort {
  execute(studioId: string): Promise<ApiResponseInterface<Heroes>>;
}

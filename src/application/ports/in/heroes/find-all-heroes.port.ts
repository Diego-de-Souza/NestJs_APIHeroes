import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Heroes } from '../../../../infrastructure/database/sequelize/models/heroes.model';

/** Port IN: contrato para listar todos os heróis. Controller → Port → UseCase. */
export interface IFindAllHeroesPort {
  execute(): Promise<ApiResponseInterface<Heroes>>;
}

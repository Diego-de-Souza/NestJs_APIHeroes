import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Heroes } from '../../../../infrastructure/database/sequelize/models/heroes.model';

/** Port IN: contrato para buscar heróis por equipe. Controller → Port → UseCase. */
export interface IFindHeroesByTeamPort {
  execute(teamName: string): Promise<ApiResponseInterface<Heroes>>;
}

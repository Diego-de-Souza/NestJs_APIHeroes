import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Team } from '../../../../infrastructure/database/sequelize/models/equipes.model';

/** Port IN: contrato para listar todas as equipes. Controller → Port → UseCase. */
export interface IFindAllTeamPort {
  execute(): Promise<ApiResponseInterface<Team>>;
}

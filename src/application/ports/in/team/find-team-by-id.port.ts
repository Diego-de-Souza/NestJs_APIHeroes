import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Team } from '../../../../infrastructure/database/sequelize/models/equipes.model';

/** Port IN: contrato para buscar equipe por ID. Controller → Port → UseCase. */
export interface IFindTeamByIdPort {
  execute(id: string): Promise<ApiResponseInterface<Team>>;
}

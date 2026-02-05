import { CreateTeamDto } from '../../../../interface/dtos/team/create-team.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Team } from '../../../../infrastructure/database/sequelize/models/equipes.model';

/** Port IN: contrato para criação de equipe. Controller → Port → UseCase. */
export interface ICreateTeamPort {
  execute(teamDto: CreateTeamDto): Promise<ApiResponseInterface<Team>>;
}

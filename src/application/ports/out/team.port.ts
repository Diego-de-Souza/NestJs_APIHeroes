import { CreateTeamDto } from '../../../interface/dtos/team/create-team.dto';
import { Team } from '../../../infrastructure/database/sequelize/models/equipes.model';

/** Port OUT: contrato do repositório de equipe. UseCase → Port → Repository. */
export interface ITeamRepository {
  findByTeam(name: string): Promise<Team | null>;
  create(teamDto: CreateTeamDto): Promise<Team | null>;
  findTeamById(id: string): Promise<Team | null>;
  findAllTeam(): Promise<Team[] | null>;
  findIdByName(name: string): Promise<string | null>;
  updateTeam(id: string, teamDto: CreateTeamDto): Promise<void>;
}

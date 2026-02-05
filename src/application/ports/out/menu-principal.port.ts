import { Studio } from '../../../infrastructure/database/sequelize/models/studio.model';
import { Team } from '../../../infrastructure/database/sequelize/models/equipes.model';
import { Heroes } from '../../../infrastructure/database/sequelize/models/heroes.model';

/** Port OUT: contrato do repositório do menu principal. UseCase → Port → Repository. */
export interface IMenuPrincipalRepository {
  findAllStudio(): Promise<Studio[] | null>;
  findAllTeam(): Promise<Team[] | null>;
  findAllMorality(): Promise<Heroes[] | null>;
  findAllGenre(): Promise<Heroes[] | null>;
}

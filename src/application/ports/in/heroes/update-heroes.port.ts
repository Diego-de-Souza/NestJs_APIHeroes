import { UpdateDadosHeroisDto } from '../../../../interface/dtos/dados-herois/update-dados-herois.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Heroes } from '../../../../infrastructure/database/sequelize/models/heroes.model';

/** Port IN: contrato para atualizar herói. Controller → Port → UseCase. */
export interface IUpdateHeroesPort {
  execute(id: string, heroesDto: UpdateDadosHeroisDto): Promise<ApiResponseInterface<Heroes>>;
}

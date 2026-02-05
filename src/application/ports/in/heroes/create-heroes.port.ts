import { CreateDadosHeroisDto } from '../../../../interface/dtos/dados-herois/create-dados-herois.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Heroes } from '../../../../infrastructure/database/sequelize/models/heroes.model';

/** Port IN: contrato para criação de herói. Controller → Port → UseCase. */
export interface ICreateHeroesPort {
  execute(heroesDto: CreateDadosHeroisDto): Promise<ApiResponseInterface<Heroes>>;
}

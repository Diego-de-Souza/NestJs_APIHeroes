import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { HeroesData } from '../../../../domain/interfaces/card_heroes.interface';

/** Port IN: contrato para buscar herói por ID. Controller → Port → UseCase. */
export interface IFindHeroesByIdPort {
  execute(id: string): Promise<ApiResponseInterface<HeroesData>>;
}

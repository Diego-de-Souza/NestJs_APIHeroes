import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para deletar herói. Controller → Port → UseCase. */
export interface IDeleteHeroesPort {
  execute(id: string): Promise<ApiResponseInterface<number>>;
}

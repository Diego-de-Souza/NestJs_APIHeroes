import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para buscar dados do menu principal. Controller → Port → UseCase. */
export interface IFindMenuDataPort {
  execute(): Promise<ApiResponseInterface<unknown>>;
}

import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para deletar jogo. Controller → Port → UseCase. */
export interface IDeleteGamePort {
  execute(id: string): Promise<ApiResponseInterface<unknown>>;
}

import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para deletar contato SAC. Controller → Port → UseCase. */
export interface IDeleteContactPort {
  execute(id: string): Promise<ApiResponseInterface<void>>;
}

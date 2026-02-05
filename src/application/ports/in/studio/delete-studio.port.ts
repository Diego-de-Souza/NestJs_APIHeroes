import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para deletar estúdio. Controller → Port → UseCase. */
export interface IDeleteStudioPort {
  execute(id: string): Promise<ApiResponseInterface<number>>;
}

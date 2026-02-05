import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para atualizar jogo. Controller → Port → UseCase. */
export interface IUpdateGamePort {
  execute(id: string, gameData: Record<string, unknown>): Promise<ApiResponseInterface<unknown>>;
}

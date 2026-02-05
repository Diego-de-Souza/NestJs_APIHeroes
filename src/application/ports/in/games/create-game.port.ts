import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para criação de jogo. Controller → Port → UseCase. */
export interface ICreateGamePort {
  execute(gameData: Record<string, unknown>): Promise<ApiResponseInterface<unknown>>;
}

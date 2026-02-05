import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para buscar dados do jogo da memória. Controller → Port → UseCase. */
export interface IFindDataMemoryGamePort {
  execute(payload: Record<string, unknown>): Promise<ApiResponseInterface<unknown>>;
}

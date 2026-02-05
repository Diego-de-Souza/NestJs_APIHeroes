import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para buscar destaques. Controller → Port → UseCase. */
export interface IFindHighlightsPort {
  execute(): Promise<ApiResponseInterface<unknown>>;
}

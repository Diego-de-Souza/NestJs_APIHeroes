import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';

/** Port IN: contrato para deletar notificação. Controller → Port → UseCase. */
export interface IDeleteNotificationPort {
  execute(id: string, usuario_id: string): Promise<ApiResponseInterface<void>>;
}

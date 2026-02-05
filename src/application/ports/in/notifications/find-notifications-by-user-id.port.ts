import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Notification } from '../../../../infrastructure/database/sequelize/models/notification.model';

/** Port IN: contrato para buscar notificações por usuário. Controller → Port → UseCase. */
export interface IFindNotificationsByUserIdPort {
  execute(usuario_id: string): Promise<ApiResponseInterface<Notification>>;
}

import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Notification } from '../../../../infrastructure/database/sequelize/models/notification.model';

/** Port IN: contrato para marcar notificação como lida. Controller → Port → UseCase. */
export interface IMarkNotificationAsReadPort {
  execute(id: string): Promise<ApiResponseInterface<Notification>>;
}

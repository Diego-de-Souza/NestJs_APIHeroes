import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Notification } from '../../../../infrastructure/database/sequelize/models/notification.model';

/** Port IN: contrato para buscar notificação por ID e usuário. Controller → Port → UseCase. */
export interface IFindNotificationByIdPort {
  execute(id: string, usuario_id: string): Promise<ApiResponseInterface<Notification>>;
}

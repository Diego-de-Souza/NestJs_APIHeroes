import { CreateNotificationDto } from '../../../../interface/dtos/notifications/create-notification.dto';
import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { Notification } from '../../../../infrastructure/database/sequelize/models/notification.model';

/** Port IN: contrato para criar notificação. Controller → Port → UseCase. */
export interface ICreateNotificationPort {
  execute(notificationDto: CreateNotificationDto): Promise<ApiResponseInterface<Notification>>;
}

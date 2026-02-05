import { CreateNotificationDto } from '../../../interface/dtos/notifications/create-notification.dto';
import { Notification } from '../../../infrastructure/database/sequelize/models/notification.model';

/** Port OUT: contrato do repositório de notificações. UseCase → Port → Repository. */
export interface INotificationsRepository {
  createNotification(notificationDto: CreateNotificationDto): Promise<Notification>;
  findNotificationById(id: string): Promise<Notification | null>;
  findNotificationByIdAndUserId(id: string, usuario_id: string): Promise<Notification | null>;
  findNotificationsByUserId(usuario_id: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  deleteNotification(id: string): Promise<number>;
  deleteNotificationByUserId(id: string, usuario_id: string): Promise<number>;
}

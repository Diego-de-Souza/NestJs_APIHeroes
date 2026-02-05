import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { NotificationsController } from "../controllers/notifications.controller";
import { NotificationsRepository } from "../../infrastructure/repositories/notifications.repository";
import { CreateNotificationUseCase } from "../../application/use-cases/notifications/create-notification.use-case";
import { FindNotificationsByUserIdUseCase } from "../../application/use-cases/notifications/find-notifications-by-user-id.use-case";
import { FindNotificationByIdUseCase } from "../../application/use-cases/notifications/find-notification-by-id.use-case";
import { MarkNotificationAsReadUseCase } from "../../application/use-cases/notifications/mark-notification-as-read.use-case";
import { DeleteNotificationUseCase } from "../../application/use-cases/notifications/delete-notification.use-case";
import { AuthModule } from "./auth.module";

/**
 * Módulo Notifications – arquitetura Clean/Hexagonal.
 * Ports IN → UseCase; Port OUT → Repository.
 */
@Module({
  imports: [
    SequelizeModule.forFeature(models),
    AuthModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsRepository,
    CreateNotificationUseCase,
    FindNotificationsByUserIdUseCase,
    FindNotificationByIdUseCase,
    MarkNotificationAsReadUseCase,
    DeleteNotificationUseCase,
    { provide: 'ICreateNotificationPort', useClass: CreateNotificationUseCase },
    { provide: 'IFindNotificationsByUserIdPort', useClass: FindNotificationsByUserIdUseCase },
    { provide: 'IFindNotificationByIdPort', useClass: FindNotificationByIdUseCase },
    { provide: 'IMarkNotificationAsReadPort', useClass: MarkNotificationAsReadUseCase },
    { provide: 'IDeleteNotificationPort', useClass: DeleteNotificationUseCase },
    { provide: 'INotificationsRepository', useClass: NotificationsRepository },
  ],
  exports: ['INotificationsRepository', NotificationsRepository],
})
export class NotificationsModule {}

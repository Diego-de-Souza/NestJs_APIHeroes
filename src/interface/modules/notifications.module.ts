import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { NotificationsController } from "../controllers/notifications.controller";
import { NotificationsService } from "../../application/services/notifications.service";
import { NotificationsRepository } from "../../infrastructure/repositories/notifications.repository";
import { CreateNotificationUseCase } from "../../application/use-cases/notifications/create-notification.use-case";
import { FindNotificationsByUserIdUseCase } from "../../application/use-cases/notifications/find-notifications-by-user-id.use-case";
import { FindNotificationByIdUseCase } from "../../application/use-cases/notifications/find-notification-by-id.use-case";
import { MarkNotificationAsReadUseCase } from "../../application/use-cases/notifications/mark-notification-as-read.use-case";
import { DeleteNotificationUseCase } from "../../application/use-cases/notifications/delete-notification.use-case";
import { AuthModule } from "./auth.module";

@Module({
    imports: [
        SequelizeModule.forFeature(models),
        AuthModule
    ],
    controllers: [NotificationsController],
    providers: [
        NotificationsService,
        NotificationsRepository,
        CreateNotificationUseCase,
        FindNotificationsByUserIdUseCase,
        FindNotificationByIdUseCase,
        MarkNotificationAsReadUseCase,
        DeleteNotificationUseCase
    ],
    exports: [NotificationsService]
})
export class NotificationsModule {}

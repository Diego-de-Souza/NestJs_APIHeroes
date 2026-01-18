import { Injectable } from "@nestjs/common";
import { CreateNotificationDto } from "../../interface/dtos/notifications/create-notification.dto";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { Notification } from "../../infrastructure/database/sequelize/models/notification.model";
import { CreateNotificationUseCase } from "../use-cases/notifications/create-notification.use-case";
import { FindNotificationsByUserIdUseCase } from "../use-cases/notifications/find-notifications-by-user-id.use-case";
import { FindNotificationByIdUseCase } from "../use-cases/notifications/find-notification-by-id.use-case";
import { MarkNotificationAsReadUseCase } from "../use-cases/notifications/mark-notification-as-read.use-case";
import { DeleteNotificationUseCase } from "../use-cases/notifications/delete-notification.use-case";

@Injectable()
export class NotificationsService {

    constructor(
        private readonly createNotificationUseCase: CreateNotificationUseCase,
        private readonly findNotificationsByUserIdUseCase: FindNotificationsByUserIdUseCase,
        private readonly findNotificationByIdUseCase: FindNotificationByIdUseCase,
        private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
        private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
    ){}

    async createNotification(notificationDto: CreateNotificationDto): Promise<ApiResponseInterface<Notification>>{
        return await this.createNotificationUseCase.createNotification(notificationDto);
    }

    async findNotificationsByUserId(usuario_id: number): Promise<ApiResponseInterface<Notification>>{
        return await this.findNotificationsByUserIdUseCase.findNotificationsByUserId(usuario_id);
    }

    async findNotificationById(id: number, usuario_id: number): Promise<ApiResponseInterface<Notification>>{
        return await this.findNotificationByIdUseCase.findNotificationById(id, usuario_id);
    }

    async markAsRead(id: number): Promise<ApiResponseInterface<Notification>>{
        return await this.markNotificationAsReadUseCase.markAsRead(id);
    }

    async deleteNotification(id: number, usuario_id: number): Promise<ApiResponseInterface<void>>{
        return await this.deleteNotificationUseCase.deleteNotification(id, usuario_id);
    }
}

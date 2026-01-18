import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Notification } from "../../../infrastructure/database/sequelize/models/notification.model";
import { NotificationsRepository } from "../../../infrastructure/repositories/notifications.repository";
import { CreateNotificationDto } from "../../../interface/dtos/notifications/create-notification.dto";

@Injectable()
export class CreateNotificationUseCase {
    private readonly logger = new Logger(CreateNotificationUseCase.name);

    constructor(
        private readonly notificationsRepository: NotificationsRepository
    ){}

    async createNotification(notificationDto: CreateNotificationDto): Promise<ApiResponseInterface<Notification>>{
        try {
            const notification = await this.notificationsRepository.createNotification(notificationDto);

            return {
                status: HttpStatus.CREATED,
                message: "Notificação criada com sucesso.",
                dataUnit: notification
            };
        } catch (error) {
            this.logger.error('Erro ao criar notificação:', error);
            throw error;
        }
    }
}

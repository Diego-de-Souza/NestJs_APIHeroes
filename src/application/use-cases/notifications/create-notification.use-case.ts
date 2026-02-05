import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Notification } from "../../../infrastructure/database/sequelize/models/notification.model";
import type { INotificationsRepository } from "../../ports/out/notifications.port";
import { CreateNotificationDto } from "../../../interface/dtos/notifications/create-notification.dto";
import type { ICreateNotificationPort } from "../../ports/in/notifications/create-notification.port";

@Injectable()
export class CreateNotificationUseCase implements ICreateNotificationPort {
    private readonly logger = new Logger(CreateNotificationUseCase.name);

    constructor(
        @Inject('INotificationsRepository') private readonly notificationsRepository: INotificationsRepository
    ) {}

    async execute(notificationDto: CreateNotificationDto): Promise<ApiResponseInterface<Notification>> {
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

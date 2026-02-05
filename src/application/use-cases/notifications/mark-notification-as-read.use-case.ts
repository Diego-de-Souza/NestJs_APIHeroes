import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Notification } from "../../../infrastructure/database/sequelize/models/notification.model";
import type { INotificationsRepository } from "../../ports/out/notifications.port";
import type { IMarkNotificationAsReadPort } from "../../ports/in/notifications/mark-notification-as-read.port";

@Injectable()
export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadPort {
    private readonly logger = new Logger(MarkNotificationAsReadUseCase.name);

    constructor(
        @Inject('INotificationsRepository') private readonly notificationsRepository: INotificationsRepository
    ) {}

    async execute(id: string): Promise<ApiResponseInterface<Notification>> {
        try {
            const notification = await this.notificationsRepository.findNotificationById(id);

            if (!notification) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Notificação não encontrada.",
                };
            }

            await this.notificationsRepository.markAsRead(id);

            // Buscar notificação atualizada
            const updatedNotification = await this.notificationsRepository.findNotificationById(id);

            return {
                status: HttpStatus.OK,
                message: "Notificação marcada como lida com sucesso.",
                dataUnit: updatedNotification
            };
        } catch (error) {
            this.logger.error('Erro ao marcar notificação como lida:', error);
            throw error;
        }
    }
}

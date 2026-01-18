import { HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Notification } from "../../../infrastructure/database/sequelize/models/notification.model";
import { NotificationsRepository } from "../../../infrastructure/repositories/notifications.repository";

@Injectable()
export class MarkNotificationAsReadUseCase {
    private readonly logger = new Logger(MarkNotificationAsReadUseCase.name);

    constructor(
        private readonly notificationsRepository: NotificationsRepository
    ){}

    async markAsRead(id: number): Promise<ApiResponseInterface<Notification>>{
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

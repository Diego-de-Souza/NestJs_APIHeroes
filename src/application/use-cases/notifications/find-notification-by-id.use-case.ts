import { HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Notification } from "../../../infrastructure/database/sequelize/models/notification.model";
import { NotificationsRepository } from "../../../infrastructure/repositories/notifications.repository";

@Injectable()
export class FindNotificationByIdUseCase {
    private readonly logger = new Logger(FindNotificationByIdUseCase.name);

    constructor(
        private readonly notificationsRepository: NotificationsRepository
    ){}

    async findNotificationById(id: number, usuario_id: number): Promise<ApiResponseInterface<Notification>>{
        try {
            const notification = await this.notificationsRepository.findNotificationByIdAndUserId(id, usuario_id);

            if (!notification) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Notificação não encontrada.",
                };
            }

            return {
                status: HttpStatus.OK,
                message: "Notificação encontrada com sucesso.",
                dataUnit: notification
            };
        } catch (error) {
            this.logger.error('Erro ao buscar notificação:', error);
            throw error;
        }
    }
}

import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Notification } from "../../../infrastructure/database/sequelize/models/notification.model";
import { NotificationsRepository } from "../../../infrastructure/repositories/notifications.repository";

@Injectable()
export class FindNotificationsByUserIdUseCase {
    private readonly logger = new Logger(FindNotificationsByUserIdUseCase.name);

    constructor(
        private readonly notificationsRepository: NotificationsRepository
    ){}

    async findNotificationsByUserId(usuario_id: number): Promise<ApiResponseInterface<Notification>>{
        try {
            const notifications = await this.notificationsRepository.findNotificationsByUserId(usuario_id);

            return {
                status: HttpStatus.OK,
                message: "Notificações encontradas com sucesso.",
                data: notifications
            };
        } catch (error) {
            this.logger.error('Erro ao buscar notificações:', error);
            throw error;
        }
    }
}

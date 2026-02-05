import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Notification } from "../../../infrastructure/database/sequelize/models/notification.model";
import type { INotificationsRepository } from "../../ports/out/notifications.port";
import type { IFindNotificationsByUserIdPort } from "../../ports/in/notifications/find-notifications-by-user-id.port";

@Injectable()
export class FindNotificationsByUserIdUseCase implements IFindNotificationsByUserIdPort {
    private readonly logger = new Logger(FindNotificationsByUserIdUseCase.name);

    constructor(
        @Inject('INotificationsRepository') private readonly notificationsRepository: INotificationsRepository
    ) {}

    async execute(usuario_id: string): Promise<ApiResponseInterface<Notification>> {
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

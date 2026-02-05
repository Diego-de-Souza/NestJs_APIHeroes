import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Notification } from "../../../infrastructure/database/sequelize/models/notification.model";
import type { INotificationsRepository } from "../../ports/out/notifications.port";
import type { IFindNotificationByIdPort } from "../../ports/in/notifications/find-notification-by-id.port";

@Injectable()
export class FindNotificationByIdUseCase implements IFindNotificationByIdPort {
    private readonly logger = new Logger(FindNotificationByIdUseCase.name);

    constructor(
        @Inject('INotificationsRepository') private readonly notificationsRepository: INotificationsRepository
    ) {}

    async execute(id: string, usuario_id: string): Promise<ApiResponseInterface<Notification>> {
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

import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { INotificationsRepository } from "../../ports/out/notifications.port";
import type { IDeleteNotificationPort } from "../../ports/in/notifications/delete-notification.port";

@Injectable()
export class DeleteNotificationUseCase implements IDeleteNotificationPort {
    private readonly logger = new Logger(DeleteNotificationUseCase.name);

    constructor(
        @Inject('INotificationsRepository') private readonly notificationsRepository: INotificationsRepository
    ) {}

    async execute(id: string, usuario_id: string): Promise<ApiResponseInterface<void>> {
        try {
            const notification = await this.notificationsRepository.findNotificationById(id);

            if (!notification) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Notificação não encontrada.",
                };
            }

            if (notification.usuario_id !== usuario_id) {
                return {
                    status: HttpStatus.FORBIDDEN,
                    message: "Acesso negado. Você não pode excluir notificações de outros usuários.",
                };
            }

            await this.notificationsRepository.deleteNotification(id);

            return {
                status: HttpStatus.OK,
                message: "Notificação excluída com sucesso.",
            };
        } catch (error) {
            this.logger.error('Erro ao excluir notificação:', error);
            throw error;
        }
    }
}

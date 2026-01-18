import { HttpStatus, Injectable, Logger, NotFoundException, ForbiddenException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { NotificationsRepository } from "../../../infrastructure/repositories/notifications.repository";

@Injectable()
export class DeleteNotificationUseCase {
    private readonly logger = new Logger(DeleteNotificationUseCase.name);

    constructor(
        private readonly notificationsRepository: NotificationsRepository
    ){}

    async deleteNotification(id: number, usuario_id: number): Promise<ApiResponseInterface<void>>{
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

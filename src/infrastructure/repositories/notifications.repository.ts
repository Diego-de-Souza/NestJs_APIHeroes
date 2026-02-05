import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Notification } from "../database/sequelize/models/notification.model";
import { CreateNotificationDto } from "../../interface/dtos/notifications/create-notification.dto";
import type { INotificationsRepository } from "../../application/ports/out/notifications.port";

@Injectable()
export class NotificationsRepository implements INotificationsRepository {

    constructor(
        @InjectModel(Notification) private readonly notificationModel: typeof Notification
    ){}

    async createNotification(notificationDto: CreateNotificationDto): Promise<Notification>{
        // Gerar tag_color baseado no type se não fornecido
        const tagColors = {
            'info': '#00d2ff',
            'success': '#4caf50',
            'warning': '#ff9800',
            'error': '#e62429',
            'system': '#9c27b0'
        };

        const notificationData = {
            ...notificationDto,
            tag_color: notificationDto.type ? tagColors[notificationDto.type] || '#00d2ff' : '#00d2ff',
            author: notificationDto.author || 'Sistema',
            type: notificationDto.type || 'info'
        };

        return await this.notificationModel.create(notificationData);
    }

    async findNotificationById(id: string): Promise<Notification | null> {
        return await this.notificationModel.findOne({ where: { id } });
    }

    async findNotificationByIdAndUserId(id: string, usuario_id: string): Promise<Notification | null> {
        return await this.notificationModel.findOne({where: {id, usuario_id}});
    }

    async findNotificationsByUserId(usuario_id: string): Promise<Notification[]>{
        return await this.notificationModel.findAll({
            where: {usuario_id},
            order: [['createdAt', 'DESC']]
        });
    }

    async markAsRead(id: string): Promise<void>{
        await this.notificationModel.update({read: true}, {where: {id}});
    }

    async deleteNotification(id: string): Promise<number> {
        return await this.notificationModel.destroy({where: {id}});
    }

    async deleteNotificationByUserId(id: string, usuario_id: string): Promise<number> {
        return await this.notificationModel.destroy({
            where: {
                id,
                usuario_id
            }
        });
    }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, ParseIntPipe } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateNotificationDto } from "../dtos/notifications/create-notification.dto";
import { NotificationsService } from "../../application/services/notifications.service";
import { Notification } from "../../infrastructure/database/sequelize/models/notification.model";
import { AuthGuard } from "../guards/auth.guard";
import { Request } from "express";

@Controller("notifications")
export class NotificationsController {

    constructor(private readonly notificationsService: NotificationsService){}

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() notificationDto: CreateNotificationDto, @Req() req: Request): Promise<ApiResponseInterface<Notification>> {
        try {
            const result = await this.notificationsService.createNotification(notificationDto);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao criar Notificação.',
                error: error.message || error,
            };
        }
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(@Query('usuario_id', ParseIntPipe) usuario_id: number, @Req() req: Request): Promise<ApiResponseInterface<Notification>> {
        try {
            const user = req['user'];
            const authenticatedUserId = user?.id || user?.sub;
            
            if (!authenticatedUserId) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            // Validar que o usuario_id da query corresponde ao usuário autenticado
            if (usuario_id !== authenticatedUserId) {
                return {
                    status: 403,
                    message: 'Acesso negado. Você não tem permissão para visualizar notificações de outros usuários.',
                };
            }

            const result = await this.notificationsService.findNotificationsByUserId(usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Notificações.',
                error: error.message || error,
            };
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<Notification>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.notificationsService.findNotificationById(id, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar Notificação.',
                error: error.message || error,
            };
        }
    }

    @Patch(':id/read')
    @UseGuards(AuthGuard)
    async markAsRead(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseInterface<Notification>> {
        try {
            const result = await this.notificationsService.markAsRead(id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao marcar notificação como lida.',
                error: error.message || error,
            };
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Promise<ApiResponseInterface<void>> {
        try {
            const user = req['user'];
            const usuario_id = user?.id || user?.sub;
            
            if (!usuario_id) {
                return {
                    status: 401,
                    message: 'Usuário não autenticado.',
                };
            }

            const result = await this.notificationsService.deleteNotification(id, usuario_id);
            return result;
        } catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar Notificação.',
                error: error.message || error,
            };
        }
    }
}

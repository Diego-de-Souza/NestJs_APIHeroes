import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateNotificationDto } from "../dtos/notifications/create-notification.dto";
import { Notification } from "../../infrastructure/database/sequelize/models/notification.model";
import { AuthGuard } from "../guards/auth.guard";
import { Request } from "express";
import type { ICreateNotificationPort } from "../../application/ports/in/notifications/create-notification.port";
import type { IFindNotificationsByUserIdPort } from "../../application/ports/in/notifications/find-notifications-by-user-id.port";
import type { IFindNotificationByIdPort } from "../../application/ports/in/notifications/find-notification-by-id.port";
import type { IMarkNotificationAsReadPort } from "../../application/ports/in/notifications/mark-notification-as-read.port";
import type { IDeleteNotificationPort } from "../../application/ports/in/notifications/delete-notification.port";

@Controller("notifications")
export class NotificationsController {
  constructor(
    @Inject('ICreateNotificationPort') private readonly createNotificationPort: ICreateNotificationPort,
    @Inject('IFindNotificationsByUserIdPort') private readonly findNotificationsByUserIdPort: IFindNotificationsByUserIdPort,
    @Inject('IFindNotificationByIdPort') private readonly findNotificationByIdPort: IFindNotificationByIdPort,
    @Inject('IMarkNotificationAsReadPort') private readonly markAsReadPort: IMarkNotificationAsReadPort,
    @Inject('IDeleteNotificationPort') private readonly deleteNotificationPort: IDeleteNotificationPort,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() notificationDto: CreateNotificationDto, @Req() req: Request): Promise<ApiResponseInterface<Notification>> {
    try {
      return await this.createNotificationPort.execute(notificationDto);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao criar Notificação.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query('usuario_id') usuario_id: string, @Req() req: Request): Promise<ApiResponseInterface<Notification>> {
    try {
      const user = req['user'];
      const authenticatedUserId = user?.id || user?.sub;

      if (!authenticatedUserId) {
        return {
          status: 401,
          message: 'Usuário não autenticado.',
        };
      }

      if (usuario_id !== authenticatedUserId) {
        return {
          status: 403,
          message: 'Acesso negado. Você não tem permissão para visualizar notificações de outros usuários.',
        };
      }

      return await this.findNotificationsByUserIdPort.execute(usuario_id);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar Notificações.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<Notification>> {
    try {
      const user = req['user'];
      const usuario_id = user?.id || user?.sub;

      if (!usuario_id) {
        return {
          status: 401,
          message: 'Usuário não autenticado.',
        };
      }

      return await this.findNotificationByIdPort.execute(id, usuario_id);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar Notificação.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Patch(':id/read')
  @UseGuards(AuthGuard)
  async markAsRead(@Param('id') id: string): Promise<ApiResponseInterface<Notification>> {
    try {
      return await this.markAsReadPort.execute(id);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao marcar notificação como lida.',
        error: (err?.message ?? String(error)),
      };
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteOne(@Param('id') id: string, @Req() req: Request): Promise<ApiResponseInterface<void>> {
    try {
      const user = req['user'];
      const usuario_id = user?.id || user?.sub;

      if (!usuario_id) {
        return {
          status: 401,
          message: 'Usuário não autenticado.',
        };
      }

      return await this.deleteNotificationPort.execute(id, usuario_id);
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao deletar Notificação.',
        error: (err?.message ?? String(error)),
      };
    }
  }
}

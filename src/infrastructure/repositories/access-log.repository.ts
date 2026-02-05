import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AccessLog } from '../database/sequelize/models/access-log.model';
import { AccessLogData } from '../../domain/interfaces/access-log.interface';

@Injectable()
export class AccessLogRepository {
    constructor(
        @InjectModel(AccessLog) private readonly accessLogModel: typeof AccessLog
    ) {}

    async create(accessData: AccessLogData): Promise<AccessLog> {
        return await this.accessLogModel.create({
            route: accessData.route,
            method: accessData.method,
            ip: accessData.ip,
            userAgent: accessData.userAgent,
            userId: accessData.userId,
            timestamp: accessData.timestamp,
            statusCode: accessData.statusCode,
            responseTime: accessData.responseTime,
            actionType: accessData.actionType || 'other'
        });
    }

    async getStats(startDate?: Date, endDate?: Date): Promise<{
        totalAccesses: number;
        uniqueUsers: number;
        pageViews: number;
        logins: number;
    }> {
        const where: any = {};
        
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp[Op.gte] = startDate;
            if (endDate) where.timestamp[Op.lte] = endDate;
        }

        const [totalAccesses, uniqueUsersResult, pageViews, logins] = await Promise.all([
            this.accessLogModel.count({ where }),
            this.accessLogModel.findAll({
                where: { ...where, userId: { [Op.ne]: null } },
                attributes: [[this.accessLogModel.sequelize.fn('DISTINCT', this.accessLogModel.sequelize.col('user_id')), 'userId']],
                raw: true
            }),
            this.accessLogModel.count({ where: { ...where, actionType: 'page_view' } }),
            this.accessLogModel.count({ where: { ...where, actionType: 'login' } })
        ]);

        return {
            totalAccesses,
            uniqueUsers: uniqueUsersResult.length,
            pageViews,
            logins
        };
    }

    async hasRecentAccess(
        userId: string | null,
        ip: string,
        actionType: string,
        minutesThreshold: number = 5
    ): Promise<boolean> {
        const thresholdDate = new Date();
        thresholdDate.setMinutes(thresholdDate.getMinutes() - minutesThreshold);

        const where: any = {
            timestamp: { [Op.gte]: thresholdDate },
            actionType
        };

        // Se tem userId, verifica por userId, senão verifica por IP
        if (userId) {
            where.userId = userId;
        } else {
            where.ip = ip;
        }

        const count = await this.accessLogModel.count({ where });
        return count > 0;
    }
}

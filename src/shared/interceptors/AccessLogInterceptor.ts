import {
    Injectable,
    Logger,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { AccessLogService } from '../../application/services/access-log.service';
import { AccessLogData } from '../../domain/interfaces/access-log.interface';

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AccessLogInterceptor.name);

    constructor(
        private readonly accessLogService: AccessLogService
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse();

        const { url, method } = request;

        // Log only signin requests here.
        if (!this.shouldLogRoute(url, method)) {
            return next.handle();
        }

        const startTime = Date.now();
        const { ip, headers } = request;
        const user = request['user'];

        const actionType = this.determineActionType(url, method);

        const accessData: AccessLogData = {
            route: url,
            method,
            ip: ip || request.connection?.remoteAddress || 'unknown',
            userAgent: headers['user-agent'],
            userId: user?.id || user?.sub || null,
            timestamp: new Date(),
            actionType
        };

        const isLoginRoute = this.isLoginRoute(url, method);

        return next.handle().pipe(
            tap({
                next: (result: any) => {
                    const responseTime = Date.now() - startTime;
                    const statusCode = response.statusCode;

                    if (isLoginRoute && !this.isSuccessStatus(statusCode)) {
                        return;
                    }

                    // On /auth/signin, req.user is usually empty.
                    // Try reading user id from the controller/use-case response payload.
                    if (!accessData.userId) {
                        accessData.userId =
                            result?.user?.id ||
                            result?.dataUnit?.user?.id ||
                            result?.data?.user?.id ||
                            null;
                    }

                    accessData.statusCode = statusCode;
                    accessData.responseTime = responseTime;

                    this.accessLogService.logAccess(accessData).catch((error) => {
                        this.logger.error('Error while registering access:', error);
                    });
                },
                error: (error) => {
                    if (isLoginRoute) {
                        return;
                    }

                    const responseTime = Date.now() - startTime;
                    accessData.statusCode = error.status || 500;
                    accessData.responseTime = responseTime;

                    this.accessLogService.logAccess(accessData).catch((err) => {
                        this.logger.error('Error while registering access (error path):', err);
                    });
                }
            })
        );
    }

    private shouldLogRoute(url: string, method: string): boolean {
        return url.includes('/auth/signin') && method === 'POST';
    }

    private determineActionType(url: string, method: string): AccessLogData['actionType'] {
        if (url.includes('/auth/signin') && method === 'POST') {
            return 'login';
        }

        return 'other';
    }

    private isLoginRoute(url: string, method: string): boolean {
        return url.includes('/auth/signin') && method === 'POST';
    }

    private isSuccessStatus(statusCode: number): boolean {
        return statusCode >= 200 && statusCode < 300;
    }
}

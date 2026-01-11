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

        // Só registra rotas específicas: home (register-acesso-user) e login (signin)
        if (!this.shouldLogRoute(url, method)) {
            // Não é uma rota que deve ser registrada, apenas continua sem registrar
            return next.handle();
        }

        const startTime = Date.now();
        const { ip, headers } = request;
        const user = request['user']; // Usuário autenticado (se houver)

        // Determina o tipo de ação baseado na rota
        const actionType = this.determineActionType(url, method);

        // Registra o acesso de forma assíncrona (não bloqueia a requisição)
        const accessData: AccessLogData = {
            route: url,
            method,
            ip: ip || request.connection?.remoteAddress || 'unknown',
            userAgent: headers['user-agent'],
            userId: user?.id || user?.sub || null,
            timestamp: new Date(),
            actionType
        };

        // Verifica se é uma rota de login
        const isLoginRoute = this.isLoginRoute(url, method);

        // Usa tap para capturar o status code e tempo de resposta após a requisição
        return next.handle().pipe(
            tap({
                next: () => {
                    const responseTime = Date.now() - startTime;
                    const statusCode = response.statusCode;

                    // Para login, só registra se for sucesso (status 2xx)
                    if (isLoginRoute && !this.isSuccessStatus(statusCode)) {
                        return; // Não registra login com falha
                    }

                    // Atualiza os dados com status code e tempo de resposta
                    accessData.statusCode = statusCode;
                    accessData.responseTime = responseTime;

                    // Registra o acesso de forma assíncrona
                    this.accessLogService.logAccess(accessData).catch((error) => {
                        this.logger.error('Erro ao registrar acesso:', error);
                    });
                },
                error: (error) => {
                    // Para login, não registra erros
                    if (isLoginRoute) {
                        return; // Não registra login com falha
                    }

                    const responseTime = Date.now() - startTime;
                    accessData.statusCode = error.status || 500;
                    accessData.responseTime = responseTime;

                    this.accessLogService.logAccess(accessData).catch((err) => {
                        this.logger.error('Erro ao registrar acesso (erro):', err);
                    });
                }
            })
        );
    }

    private shouldLogRoute(url: string, method: string): boolean {
        // Registra apenas Login: /api/auth/signin (POST)
        // A rota /api/auth/register-acesso-user já tem sua própria lógica de registro
        // com controle de duplicatas, então não deve ser registrada pelo interceptor
        return url.includes('/auth/signin') && method === 'POST';
    }

    private determineActionType(url: string, method: string): AccessLogData['actionType'] {
        // Login
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

import {
    Injectable,
    Logger,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class LogInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LogInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
      const request = context.switchToHttp().getRequest();
      const { body, files } = request;
  
      this.logger.debug('Dados do corpo da requisição:', body);
      this.logger.debug('Arquivos recebidos:', files);
  
      return next.handle();
    }
  }
  
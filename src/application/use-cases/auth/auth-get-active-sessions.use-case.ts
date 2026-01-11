import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../../infrastructure/repositories/auth.repository";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGetActiveSessionsUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly httpService: HttpService
  ) {}

  async getActiveSessions(userId: number, currentSessionToken?: string): Promise<any> {
    try {
      const sessions = await this.authRepository.findValidationsByUserId(userId);
      
      const formattedSessions = await Promise.all(
        sessions.map(async (session) => {
          const device = this.parseDeviceInfo(session.device_info);
          const location = await this.getLocationByIP(session.ip_address);
          const isCurrent = session.token_id === currentSessionToken;
          
          return {
            id: session.id,
            device: device,
            location: location,
            lastActive: this.formatLastActive(session.last_used_at || session.created_at),
            isCurrent: isCurrent,
            isLoggingOut: false
          };
        })
      );

      return {
        status: 200,
        message: 'Sessões ativas encontradas',
        sessions: formattedSessions,
        totalSessions: formattedSessions.length
      };
    } catch (error) {
      throw new Error(`Erro ao buscar sessões ativas: ${error.message}`);
    }
  }

  private parseDeviceInfo(userAgent: string): string {
    if (!userAgent || userAgent === 'unknown') {
      return 'Dispositivo desconhecido';
    }

    let os = 'Unknown OS';
    if (userAgent.includes('Windows NT 10.0')) os = 'Windows 10';
    else if (userAgent.includes('Windows NT 6.3')) os = 'Windows 8.1';
    else if (userAgent.includes('Windows NT 6.1')) os = 'Windows 7';
    else if (userAgent.includes('Mac OS X')) os = 'macOS';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone')) os = 'iOS';
    else if (userAgent.includes('Linux')) os = 'Linux';

    let browser = 'Unknown Browser';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edg')) browser = 'Edge';

    let deviceType = 'Desktop';
    if (userAgent.includes('Mobile')) deviceType = 'Mobile';
    else if (userAgent.includes('Tablet')) deviceType = 'Tablet';

    return `${deviceType} ${browser} - ${os}`;
  }

  private async getLocationByIP(ipAddress: string): Promise<string> {
    try {
      if (!ipAddress || ipAddress === 'unknown' || ipAddress === '::1' || ipAddress === '127.0.0.1') {
        return 'Local/Desenvolvimento';
      }

      // Usar serviço gratuito
      const response = await firstValueFrom(
        this.httpService.get(`https://ipapi.co/${ipAddress}/json/`)
      );
      const data = response.data;
      
      if (data.city && data.country_name) {
        return `${data.city}, ${data.country_name}`;
      }
      
      return 'Localização desconhecida';
    } catch (error) {
      return 'Localização indisponível';
    }
  }

  private formatLastActive(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes} minutos atrás`;
    if (hours < 24) return `${hours} horas atrás`;
    if (days === 1) return 'Ontem';
    return `${days} dias atrás`;
  }
}
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";

@Injectable()
export class AuthMFAInUseCase {
    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    async generateMfaCode(req, typeCanal: string): Promise<any> {
        try{
            switch (typeCanal) {
                case 'email':
                    return await this.authRepository.validateMfaCodeEmail(req, code);
                case 'sms':
                    return await this.authRepository.validateMfaCodeSMS(req, code);
                case 'whatsapp':
                    return await this.authRepository.validateMfaCodeWhatsApp(req, code);
                default:
                    throw new UnauthorizedException('Canal de MFA inválido.');
            }
        }catch(error){

        }
    }


    async validateMfaCode(req, code: string, typeCanal: string): Promise<any> {
        try{
            const user = (req as any).user;
            if (!user || !user.sub) {
                throw new UnauthorizedException('Usuário não autenticado.');
            }
            const existingUser = await this.authRepository.findUserById(user.sub);
            if (!existingUser) {
                throw new UnauthorizedException('Usuário não encontrado.');
            }
            
        }catch(error){
            throw new UnauthorizedException('Erro ao validar código MFA.', error.message);
        }
    }
}
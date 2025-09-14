import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";

@Injectable()
export class GenerateCodeInUseCase {
    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    async generateMfaCode(req, typeCanal: string): Promise<any> {
        try{
            const user = (req as any).user;

            if (!user || !user.sub) {
                throw new UnauthorizedException('Usuário não autenticado.');
            }

            const existingUser = await this.authRepository.findUserById(user.sub);
            console.log('Usuário encontrado para MFA:', existingUser);
            if (!existingUser) {
                throw new UnauthorizedException('Usuário não encontrado.');
            }

            const code = await this.generateRandomCode();
            console.log('Código MFA gerado:', code);
            if(!code){
                throw new UnauthorizedException('Erro ao gerar código MFA.');
            }

            await this.sendCode(typeCanal, code, existingUser.firstemail);
            
            await this.authRepository.saveMfaCode(existingUser.id, code);

            return {
                status: 200,
                message: `Código MFA enviado com sucesso via ${typeCanal}.`
            };
        }catch(error){
            throw new UnauthorizedException('Erro ao enviar código MFA.', error.message);
        }
    }

    async sendCode(typeCanal: string, code: string, data:string): Promise<boolean> {
        try{
            switch(typeCanal){
                case 'email':
                    // Lógica para enviar o código por email
                    console.log(`Enviando código MFA ${code} para o email ${data}`);
                    break;
                case 'sms':
                    // Lógica para enviar o código por SMS
                    console.log(`Enviando código MFA ${code} para o telefone ${data}`);
                    break;
                case 'whatsapp':
                    // Lógica para enviar o código por WhatsApp
                    console.log(`Enviando código MFA ${code} para o WhatsApp ${data}`);
                    break;
                default:
                    throw new UnauthorizedException('Canal de envio inválido.');
            }

            return true;
        }catch(error){
            throw new UnauthorizedException(`Erro ao enviar código por ${typeCanal}.`, error.message);
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

            const isValid = code === existingUser.mfa_secret ? true : false;

            if (!isValid) {
                return {
                    status: 401,
                    message: 'Código MFA inválido.'
                };
            }

            return {
                status: 200,
                message: 'Código MFA validado com sucesso.'
            };

        }catch(error){
            throw new UnauthorizedException('Erro ao validar código MFA.', error.message);
        }
    }

    async generateRandomCode(length: number = 9): Promise<string> {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async generateCodePassword(typeCanal: string, data: string): Promise<any> {
        try{
            if(!typeCanal || !data){
                return {
                    status: 400,
                    message: 'Parâmetros inválidos.'
                };
            }

            const code = await this.generateRandomCode(9);

            if(!code){
                throw new UnauthorizedException('Erro ao gerar código para redefinição de senha.');
            }

            await this.sendCode(typeCanal, code, data);

            await this.authRepository.saveCodePassword(data, code);

            return {
                status: 200,
                message: `Código para redefinição de senha enviado com sucesso via ${typeCanal}.`
            };
        }catch(error){
            throw new UnauthorizedException('Erro ao enviar código para redefinição de senha.', error.message);
        }
    }
}

import { Injectable, Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GenenerateHashUseCase {
    private readonly logger = new Logger(GenenerateHashUseCase.name);
    
    constructor( 
        private config: ConfigService,
    ){}

    async generateHash(pass: string): Promise<string>{
        try{
            const saltRounds = this.config.get('SALT_ROUNDS')
            
            if (!saltRounds) {
                throw new Error("A variável de ambiente SALT_ROUNDS não está configurada.");
            }
            
            const salt = await bcrypt.genSalt(parseInt(saltRounds));
            const hashedPassword = await bcrypt.hash(pass, salt);
            
            return hashedPassword;
        }catch(error){
            this.logger.error("Erro ao gerar o hash da senha:", error);
            throw new Error("Erro ao processar a senha.");
        }
    }
}
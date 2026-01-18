import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacContact } from "../../../infrastructure/database/sequelize/models/sac-contact.model";
import { SacRepository } from "../../../infrastructure/repositories/sac.repository";
import { CreateContactDto } from "../../../interface/dtos/sac/create-contact.dto";

@Injectable()
export class CreateContactUseCase {
    private readonly logger = new Logger(CreateContactUseCase.name);

    constructor(
        private readonly sacRepository: SacRepository
    ){}

    async createContact(contactDto: CreateContactDto, usuario_id: number): Promise<ApiResponseInterface<SacContact>>{
        try {
            const contact = await this.sacRepository.createContact(contactDto, usuario_id);

            return {
                status: HttpStatus.CREATED,
                message: `Sua solicitação foi enviada com sucesso! Entraremos em contato em breve.`,
                dataUnit: contact
            };
        } catch (error) {
            this.logger.error('Erro ao criar solicitação de contato:', error);
            throw error;
        }
    }
}

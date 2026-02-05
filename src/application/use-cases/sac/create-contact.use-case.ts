import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacContact } from "../../../infrastructure/database/sequelize/models/sac-contact.model";
import { CreateContactDto } from "../../../interface/dtos/sac/create-contact.dto";
import type { ISacRepository } from "../../ports/out/sac.port";
import type { ICreateContactPort } from "../../ports/in/sac/create-contact.port";

@Injectable()
export class CreateContactUseCase implements ICreateContactPort {
    private readonly logger = new Logger(CreateContactUseCase.name);

    constructor(
        @Inject('ISacRepository') private readonly sacRepository: ISacRepository
    ){}

    async execute(contactDto: CreateContactDto, usuario_id: string): Promise<ApiResponseInterface<SacContact>>{
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

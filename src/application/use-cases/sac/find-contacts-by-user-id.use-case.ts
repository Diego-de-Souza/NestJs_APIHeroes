import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacContact } from "../../../infrastructure/database/sequelize/models/sac-contact.model";
import { SacRepository } from "../../../infrastructure/repositories/sac.repository";

@Injectable()
export class FindContactsByUserIdUseCase {
    private readonly logger = new Logger(FindContactsByUserIdUseCase.name);

    constructor(
        private readonly sacRepository: SacRepository
    ){}

    async findContactsByUserId(usuario_id: string, filters?: { type?: string, status?: string }): Promise<ApiResponseInterface<SacContact>>{
        try {
            const contacts = await this.sacRepository.findContactsByUserId(usuario_id, filters);

            return {
                status: HttpStatus.OK,
                message: "Solicitações encontradas com sucesso.",
                data: contacts
            };
        } catch (error) {
            this.logger.error('Erro ao buscar solicitações:', error);
            throw error;
        }
    }
}

import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacContact } from "../../../infrastructure/database/sequelize/models/sac-contact.model";
import { SacRepository } from "../../../infrastructure/repositories/sac.repository";
import { FilterContactsDto } from "../../../interface/dtos/sac/filter-contacts.dto";

@Injectable()
export class FindAllContactsUseCase {
    private readonly logger = new Logger(FindAllContactsUseCase.name);

    constructor(
        private readonly sacRepository: SacRepository
    ){}

    async findAllContacts(filters: FilterContactsDto): Promise<ApiResponseInterface<SacContact>>{
        try {
            const { contacts, total } = await this.sacRepository.findAllContacts(filters);

            const page = filters.page || 1;
            const limit = Math.min(filters.limit || 20, 100);
            const totalPages = Math.ceil(total / limit);

            return {
                status: HttpStatus.OK,
                message: "Solicitações encontradas com sucesso.",
                data: contacts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            } as any;
        } catch (error) {
            this.logger.error('Erro ao buscar solicitações:', error);
            throw error;
        }
    }
}

import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacContact } from "../../../infrastructure/database/sequelize/models/sac-contact.model";
import { FilterContactsDto } from "../../../interface/dtos/sac/filter-contacts.dto";
import type { ISacRepository } from "../../ports/out/sac.port";
import type { IFindAllContactsPort } from "../../ports/in/sac/find-all-contacts.port";

@Injectable()
export class FindAllContactsUseCase implements IFindAllContactsPort {
    private readonly logger = new Logger(FindAllContactsUseCase.name);

    constructor(
        @Inject('ISacRepository') private readonly sacRepository: ISacRepository
    ){}

    async execute(filters: FilterContactsDto): Promise<ApiResponseInterface<SacContact>>{
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

import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacContact } from "../../../infrastructure/database/sequelize/models/sac-contact.model";
import { UpdateStatusDto } from "../../../interface/dtos/sac/update-status.dto";
import type { ISacRepository } from "../../ports/out/sac.port";
import type { IUpdateContactStatusPort } from "../../ports/in/sac/update-contact-status.port";

@Injectable()
export class UpdateContactStatusUseCase implements IUpdateContactStatusPort {
    private readonly logger = new Logger(UpdateContactStatusUseCase.name);

    constructor(
        @Inject('ISacRepository') private readonly sacRepository: ISacRepository
    ){}

    async execute(id: string, statusDto: UpdateStatusDto): Promise<ApiResponseInterface<SacContact>>{
        try {
            const contact = await this.sacRepository.findContactById(id);

            if (!contact) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Solicitação não encontrada.",
                };
            }

            await this.sacRepository.updateContactStatus(id, statusDto.status);

            const updatedContact = await this.sacRepository.findContactById(id);

            return {
                status: HttpStatus.OK,
                message: "Status atualizado com sucesso.",
                dataUnit: updatedContact
            };
        } catch (error) {
            this.logger.error('Erro ao atualizar status da solicitação:', error);
            throw error;
        }
    }
}

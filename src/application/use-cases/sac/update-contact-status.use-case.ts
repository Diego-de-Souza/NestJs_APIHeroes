import { HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacContact } from "../../../infrastructure/database/sequelize/models/sac-contact.model";
import { SacRepository } from "../../../infrastructure/repositories/sac.repository";
import { UpdateStatusDto } from "../../../interface/dtos/sac/update-status.dto";

@Injectable()
export class UpdateContactStatusUseCase {
    private readonly logger = new Logger(UpdateContactStatusUseCase.name);

    constructor(
        private readonly sacRepository: SacRepository
    ){}

    async updateStatus(id: number, statusDto: UpdateStatusDto): Promise<ApiResponseInterface<SacContact>>{
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

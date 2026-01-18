import { HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacRepository } from "../../../infrastructure/repositories/sac.repository";

@Injectable()
export class DeleteContactUseCase {
    private readonly logger = new Logger(DeleteContactUseCase.name);

    constructor(
        private readonly sacRepository: SacRepository
    ){}

    async deleteContact(id: number): Promise<ApiResponseInterface<void>>{
        try {
            const contact = await this.sacRepository.findContactById(id);

            if (!contact) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Solicitação não encontrada.",
                };
            }

            await this.sacRepository.deleteContact(id);

            return {
                status: HttpStatus.OK,
                message: "Solicitação excluída com sucesso.",
            };
        } catch (error) {
            this.logger.error('Erro ao excluir solicitação:', error);
            throw error;
        }
    }
}

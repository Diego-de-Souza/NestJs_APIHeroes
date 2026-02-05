import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { ISacRepository } from "../../ports/out/sac.port";
import type { IDeleteContactPort } from "../../ports/in/sac/delete-contact.port";

@Injectable()
export class DeleteContactUseCase implements IDeleteContactPort {
    private readonly logger = new Logger(DeleteContactUseCase.name);

    constructor(
        @Inject('ISacRepository') private readonly sacRepository: ISacRepository
    ){}

    async execute(id: string): Promise<ApiResponseInterface<void>>{
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

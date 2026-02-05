import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacContact } from "../../../infrastructure/database/sequelize/models/sac-contact.model";
import type { ISacRepository } from "../../ports/out/sac.port";
import type { IFindContactByIdPort } from "../../ports/in/sac/find-contact-by-id.port";

@Injectable()
export class FindContactByIdUseCase implements IFindContactByIdPort {
    private readonly logger = new Logger(FindContactByIdUseCase.name);

    constructor(
        @Inject('ISacRepository') private readonly sacRepository: ISacRepository
    ){}

    async execute(id: string, usuario_id: string | null): Promise<ApiResponseInterface<SacContact>>{
        try {
            const contact = usuario_id ? await this.sacRepository.findContactByIdAndUserId(id, usuario_id) : await this.sacRepository.findContactById(id);

            if (!contact) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Solicitação não encontrada.",
                };
            }

            // Buscar respostas relacionadas
            const responses = await this.sacRepository.findResponsesByContactId(id);
            const contactWithResponses = {
                ...contact.toJSON(),
                responses
            } as any;

            return {
                status: HttpStatus.OK,
                message: "Solicitação encontrada com sucesso.",
                dataUnit: contactWithResponses
            };
        } catch (error) {
            this.logger.error('Erro ao buscar solicitação:', error);
            throw error;
        }
    }
}

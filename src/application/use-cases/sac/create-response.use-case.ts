import { HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacResponse } from "../../../infrastructure/database/sequelize/models/sac-response.model";
import { CreateResponseDto } from "../../../interface/dtos/sac/create-response.dto";
import type { ISacRepository } from "../../ports/out/sac.port";
import type { ICreateResponsePort } from "../../ports/in/sac/create-response.port";

@Injectable()
export class CreateResponseUseCase implements ICreateResponsePort {
    private readonly logger = new Logger(CreateResponseUseCase.name);

    constructor(
        @Inject('ISacRepository') private readonly sacRepository: ISacRepository
    ){}

    async execute(contact_id: string, responseDto: CreateResponseDto, author: string): Promise<ApiResponseInterface<SacResponse>>{
        try {
            const contact = await this.sacRepository.findContactById(contact_id);

            if (!contact) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: "Solicitação não encontrada.",
                };
            }

            const response = await this.sacRepository.createResponse(contact_id, responseDto, author);

            return {
                status: HttpStatus.OK,
                message: "Resposta adicionada com sucesso.",
                dataUnit: response
            };
        } catch (error) {
            this.logger.error('Erro ao criar resposta:', error);
            throw error;
        }
    }
}

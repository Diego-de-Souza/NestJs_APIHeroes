import { HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { SacResponse } from "../../../infrastructure/database/sequelize/models/sac-response.model";
import { SacRepository } from "../../../infrastructure/repositories/sac.repository";
import { CreateResponseDto } from "../../../interface/dtos/sac/create-response.dto";

@Injectable()
export class CreateResponseUseCase {
    private readonly logger = new Logger(CreateResponseUseCase.name);

    constructor(
        private readonly sacRepository: SacRepository
    ){}

    async createResponse(contact_id: number, responseDto: CreateResponseDto, author: string): Promise<ApiResponseInterface<SacResponse>>{
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

import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Studio } from "../../../infrastructure/database/sequelize/models/studio.model";
import type { IStudioRepository } from "../../ports/out/studio.port";
import type { IFindStudioByIdPort } from "../../ports/in/studio/find-studio-by-id.port";

@Injectable()
export class FindStudioByIdUseCase implements IFindStudioByIdPort {
    constructor(
        @Inject('IStudioRepository') private readonly studioRepository: IStudioRepository
    ) {}

    async execute(id: string): Promise<ApiResponseInterface<Studio>> {
        const studio = await this.studioRepository.findStudioById(id);

        if(!studio){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Nenhum studio foi encontrado."
            }
        }

        return {
            status: HttpStatus.OK,
            message: "Studio encontrado com sucesso.",
            dataUnit: studio
        }
    }
}
import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Studio } from "../../../infrastructure/database/sequelize/models/studio.model";
import type { IStudioRepository } from "../../ports/out/studio.port";
import type { IFindAllStudioPort } from "../../ports/in/studio/find-all-studio.port";

@Injectable()
export class FindAllStudioUseCase implements IFindAllStudioPort {
    constructor(
        @Inject('IStudioRepository') private readonly studioRepository: IStudioRepository
    ) {}

    async execute(): Promise<ApiResponseInterface<Studio>> {
        const studioAll = await this.studioRepository.findAllStudio();

        if(!studioAll){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Studios não encontrados."
            }
        }

        return{
            status: HttpStatus.OK,
            message: "Studios encontrados com sucesso.",
            data: studioAll
        }
    }
}
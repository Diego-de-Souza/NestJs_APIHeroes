import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IStudioRepository } from "../../ports/out/studio.port";
import type { IDeleteStudioPort } from "../../ports/in/studio/delete-studio.port";

@Injectable()
export class DeleteStudioUseCase implements IDeleteStudioPort {
    constructor(
        @Inject('IStudioRepository') private readonly studioRepository: IStudioRepository
    ) {}

    async execute(id: string): Promise<ApiResponseInterface<number>> {
        const deleted = await this.studioRepository.DeleteStudio(id);

        if (deleted === 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Studio não encontrado, remoção falhou."
            }
        }

        return {
            status: HttpStatus.OK,
            message: "Studio removido com sucesso.",
        }
    }
}
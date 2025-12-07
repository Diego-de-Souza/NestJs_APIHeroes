import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { StudioRepository } from "../../../infrastructure/repositories/studio.repository";

@Injectable()
export class DeleteStudioUseCase {

    constructor(
        private readonly studioRepository: StudioRepository
    ){}

    async deleteStudio(id: number): Promise<ApiResponseInterface<number>>{
        const deleteStudio = await this.studioRepository.DeleteStudio(id);

        if(deleteStudio === 0){
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
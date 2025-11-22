import { Injectable } from "@nestjs/common";
import { CreateStudioUseCase } from "src/application/use-cases/studio/create-studio.use-case";
import { CreateStudioDto } from "src/interface/dtos/studio/create-studio.dto";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Studio } from "src/infrastructure/database/sequelize/models/studio.model";
import { FindAllStudioUseCase } from "src/application/use-cases/studio/find-all-studio.use-case";
import { DeleteStudioUseCase } from "src/application/use-cases/studio/delete-studio.use-case";
import { FindStudioByIdUseCase } from "src/application/use-cases/studio/find-studio-by-id.use-case";
import { UpdateStudioUseCase } from "src/application/use-cases/studio/update-studio.use-case";


@Injectable()
export class StudioService {
    
    constructor(
        private readonly createStudioUseCase: CreateStudioUseCase,
        private readonly findAllStudioUseCase: FindAllStudioUseCase,
        private readonly deleteStudioUseCase: DeleteStudioUseCase,
        private readonly findStudioByIdUseCase: FindStudioByIdUseCase,
        private readonly updateStudioUseCase: UpdateStudioUseCase
    ){}

    async create(studioDto: CreateStudioDto): Promise<ApiResponseInterface<Studio>>{
        return await this.createStudioUseCase.createStudio(studioDto);
    }

    async findAllStudio (): Promise<ApiResponseInterface<Studio>>{
        return await this.findAllStudioUseCase.findAllStudio();
    }

    async DeleteStudio(id: number): Promise<ApiResponseInterface<number>>{
        return await this.deleteStudioUseCase.deleteStudio(id);
    }

    async findStudioById(id: number): Promise<ApiResponseInterface<Studio>>{
        return await this.findStudioByIdUseCase.findStudioById(id);
    }

    async updateStudio(id: number, studioDto: CreateStudioDto): Promise<ApiResponseInterface<Studio>>{
        return await this.updateStudioUseCase.updateStudio(id, studioDto);
    }
}
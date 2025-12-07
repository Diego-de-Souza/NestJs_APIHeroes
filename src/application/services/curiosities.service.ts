import { Injectable } from "@nestjs/common";
import { CreateCuriosityUseCase } from "../../application/use-cases/curiosities/create-curiosities.use-case";
import { CreateCuriositiesDto } from "../../interface/dtos/curiosities/curiositiesCreate.dto";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { Curiosities } from "../../infrastructure/database/sequelize/models/curiosities.model";
import { UpdateCuriositiesDto } from "../../interface/dtos/curiosities/curiositiesUpdate.dto";
import { UpdateCuriosityUseCase } from "../../application/use-cases/curiosities/update-curiosities.use-case";
import { FindCuriosityByIdUseCase } from "../../application/use-cases/curiosities/find-curiosities-by-id.use-case";
import { FindAllCuriositiesUseCase } from "../../application/use-cases/curiosities/find-all-curiosities.use-case";
import { DeleteCuriosityUseCase } from "../../application/use-cases/curiosities/delete-curiosity.use-case";

@Injectable()
export class CuriosityService {
    
    constructor(
        private readonly createCuriosityUseCase: CreateCuriosityUseCase,
        private readonly updateCuriosityUseCase: UpdateCuriosityUseCase,
        private readonly findCuriosityByIdUsecase: FindCuriosityByIdUseCase,
        private readonly findAllCuriositiesUseCase: FindAllCuriositiesUseCase,
        private readonly deleteCuriosityUseCase: DeleteCuriosityUseCase
    ){}

    async createCuriosity(curiosityDto: CreateCuriositiesDto): Promise<ApiResponseInterface<Curiosities>>{
        return await this.createCuriosityUseCase.createCuriosity(curiosityDto);
    }

    async updateCuriosity(id:number, curiosityDto:UpdateCuriositiesDto): Promise<ApiResponseInterface<Curiosities>>{
        return await this.updateCuriosityUseCase.updateCuriosity(id, curiosityDto);
    }

    async findCuriosityById(id: number): Promise<ApiResponseInterface<Curiosities>>{
        return await this.findCuriosityByIdUsecase.findCuriosityById(id);
    }

    async findAllCuriosity(): Promise<ApiResponseInterface<Curiosities>>{
        return await this.findAllCuriositiesUseCase.findAllCuriosities();
    }

    async deleteCuriosity(id: number): Promise<ApiResponseInterface<number>>{
        return await this.deleteCuriosityUseCase.DeleteCuriosity(id);
    }
}
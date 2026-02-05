import { InjectModel } from "@nestjs/sequelize";
import { Studio } from "../database/sequelize/models/studio.model";
import { Injectable } from "@nestjs/common";
import { CreateStudioDto } from "../../interface/dtos/studio/create-studio.dto";
import type { IStudioRepository } from "../../application/ports/out/studio.port";

@Injectable()
export class StudioRepository implements IStudioRepository {
    constructor(@InjectModel(Studio) private readonly studioModel: typeof Studio) {}

    async findStudioByName(name: string): Promise<Studio | null>{
        return await this.studioModel.findOne({where: {name}})
    }

    async create(studioDto: CreateStudioDto): Promise<Studio | null>{
        return await this.studioModel.create(studioDto);
    }

    async findAllStudio(): Promise<Studio[] | null>{
        return await this.studioModel.findAll();
    }

    async DeleteStudio(id: string): Promise<number>{
        return await this.studioModel.destroy({where: {id}});
    }

    async findStudioById(id: string): Promise<Studio | null> {
        return await this.studioModel.findOne({where: {id}});
    }

    async updateStudio(id: string, studioDto: CreateStudioDto): Promise<void>{
        const studio = new Studio(studioDto)
        await this.studioModel.update(studio, {where: {id}});
    }
}
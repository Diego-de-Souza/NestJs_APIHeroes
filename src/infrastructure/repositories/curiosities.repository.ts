import { InjectModel } from "@nestjs/sequelize";
import { Curiosities } from "../database/sequelize/models/curiosities.model";
import { Injectable } from "@nestjs/common";
import { UpdateCuriositiesDto } from "../../interface/dtos/curiosities/curiositiesUpdate.dto";
import { CreateCuriositiesDto } from "../../interface/dtos/curiosities/curiositiesCreate.dto";

@Injectable()
export class CuriosityRepository {

    constructor(
        @InjectModel(Curiosities) private readonly curiosityModel: typeof Curiosities
    ){}

    async findCuriosityByName(title: string): Promise<Curiosities>{
        return await this.curiosityModel.findOne({where: {title}})
    }

    async createCuriositity(curiositiesDto: CreateCuriositiesDto): Promise<Curiosities>{
        return await this.curiosityModel.create(curiositiesDto);
    }

    async findCuriosityById(id:number): Promise<Curiosities>{
        return await this.curiosityModel.findOne({where: {id}});
    }

    async updateCuriosity(id:number, curiosityDto: UpdateCuriositiesDto): Promise<void>{
        const curiosity = new Curiosities(curiosityDto);
        await this.curiosityModel.update(curiosity, {where: {id}});
    }

    async findAllCuriosities(): Promise<Curiosities[]>{
        return await this.curiosityModel.findAll();
    }

    async deleteCuriosity(id:number): Promise<number>{
        return await this.curiosityModel.destroy({where: {id}});
    }
}
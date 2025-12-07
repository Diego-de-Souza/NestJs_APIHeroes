import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { AuthGuard } from "../guards/auth.guard";
import { CuriosityService } from "../../application/services/curiosities.service";
import { CreateCuriositiesDto } from "../dtos/curiosities/curiositiesCreate.dto";
import { UpdateCuriositiesDto } from "../dtos/curiosities/curiositiesUpdate.dto";
import { Curiosities } from "../../infrastructure/database/sequelize/models/curiosities.model";

@Controller("curiosities")
export class CuriositiesController {

    constructor(private readonly curiositiesService : CuriosityService){}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() curiositiesDto: CreateCuriositiesDto): Promise<ApiResponseInterface<CreateCuriositiesDto>> {
        try{
            const result = await this.curiositiesService.createCuriosity(curiositiesDto);
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao registrar curiosidade.',
                error: error.message || error,
            };
        }
    }

    @UseGuards(AuthGuard)
    @Put('update/:id')
    async update(@Body() curiositiesDto: UpdateCuriositiesDto, @Param("id") id: number): Promise<ApiResponseInterface<Curiosities>> {
        try{
            const result = await this.curiositiesService.updateCuriosity(id, curiositiesDto);
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao registrar curiosidade.',
                error: error.message || error,
            };
        }
    }

    @Get('find-one-curiosity/:id')
    async findOne(@Param("id") id: number): Promise<ApiResponseInterface<CreateCuriositiesDto>> {
        try{
            const result = await this.curiositiesService.findCuriosityById(id);
            return result; 
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar curiosidade.',
                error: error.message || error,
            };
        }
    }

    @Get('find-all-curiosities')
    async findAll(): Promise<ApiResponseInterface<CreateCuriositiesDto>> {
        try{
            const result = await this.curiositiesService.findAllCuriosity();
            return result; 
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar curiosidades.',
                error: error.message || error,
            };
        }
    }

    @UseGuards(AuthGuard)
    @Delete('delete-one-curiosity/:id')
    async deleteOne(@Param("id") id: number): Promise<ApiResponseInterface<number>> {
        try{
            const result = await this.curiositiesService.deleteCuriosity(id);
            return result; 
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar curiosidade.',
                error: error.message || error,
            };
        }
    }
}
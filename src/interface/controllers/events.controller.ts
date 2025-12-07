import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { EventsService } from "../../application/services/events.service";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";


@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService
    ) {}

    @Post()
    async createEvent(@Body() eventDto: any): Promise<ApiResponseInterface<string>> {
        try{
            const result = await this.eventsService.createRegisterEvent(eventDto);
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao criar evento.',
                error: error.message || error,
            };
        }
    }

    @Get()
    async getEvents() {
        try{
            const result = await this.eventsService.getEvents();
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar eventos.',
                error: error.message || error,
            };
        }
    }

    @Delete('delete/:id')
    async deleteEvent(@Param("id") id: number): Promise<ApiResponseInterface<number>> {
        try{
            const result = await this.eventsService.deleteEvent(id);
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao deletar evento.',
                error: error.message || error,
            };
        }
    }

    @Get('list-home')
    async listEventsHome() {
        try{
            const result = await this.eventsService.listEventsHome();
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar eventos para home.',
                error: error.message || error,
            };
        }
    }
}
import { Body, Controller, Delete, Get, Param, Post, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import type { ICreateEventPort } from "../../application/ports/in/events/create-event.port";
import type { IFindEventsPort } from "../../application/ports/in/events/find-events.port";
import type { IDeleteEventPort } from "../../application/ports/in/events/delete-event.port";
import type { IFindEventsListHomePort } from "../../application/ports/in/events/find-events-list-home.port";

@Controller('events')
export class EventsController {
    constructor(
        @Inject('ICreateEventPort') private readonly createEventPort: ICreateEventPort,
        @Inject('IFindEventsPort') private readonly findEventsPort: IFindEventsPort,
        @Inject('IDeleteEventPort') private readonly deleteEventPort: IDeleteEventPort,
        @Inject('IFindEventsListHomePort') private readonly findEventsListHomePort: IFindEventsListHomePort
    ) {}

    @Post()
    async createEvent(@Body() eventDto: any): Promise<ApiResponseInterface<string>> {
        try {
            return await this.createEventPort.execute(eventDto);
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao criar evento.', error: error.message || error };
        }
    }

    @Get()
    async getEvents() {
        try {
            return await this.findEventsPort.execute();
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao buscar eventos.', error: error.message || error };
        }
    }

    @Delete('delete/:id')
    async deleteEvent(@Param("id") id: string): Promise<ApiResponseInterface<number>> {
        try {
            return await this.deleteEventPort.execute(id);
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao deletar evento.', error: error.message || error };
        }
    }

    @Get('list-home')
    async listEventsHome() {
        try {
            return await this.findEventsListHomePort.execute();
        } catch (error) {
            return { status: 500, message: 'Erro inesperado ao buscar eventos para home.', error: error.message || error };
        }
    }
}

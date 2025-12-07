import { Controller, Get } from "@nestjs/common";
import { HighlightsService } from "src/application/services/highlights.service";


@Controller('highlights')
export class HighlightsController {
    constructor(
        private readonly highlightsService: HighlightsService
    ) {}

    @Get()
    async getHighlights() {
        try{
            const result = await this.highlightsService.getHighlights();
            return result;
        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar destaques.',
                error: error.message || error,
            };
        }
    }
}
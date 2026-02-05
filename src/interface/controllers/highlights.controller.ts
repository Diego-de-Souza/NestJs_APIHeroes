import { Controller, Get, Inject } from "@nestjs/common";
import type { IFindHighlightsPort } from "../../application/ports/in/highlights/find-highlights.port";

@Controller('highlights')
export class HighlightsController {
  constructor(
    @Inject('IFindHighlightsPort') private readonly findHighlightsPort: IFindHighlightsPort
  ) {}

  @Get()
  async getHighlights() {
    try {
      return await this.findHighlightsPort.execute();
    } catch (error: unknown) {
      const err = error as Error;
      return {
        status: 500,
        message: 'Erro inesperado ao buscar destaques.',
        error: err?.message || error,
      };
    }
  }
}

import { Injectable } from "@nestjs/common";
import { FindHighlightsUseCase } from "../use-cases/highlights/find-highlights.use-case";


@Injectable()
export class HighlightsService {
    constructor(
        private readonly findHighlightsUseCase: FindHighlightsUseCase,
    ) {}

    async getHighlights() {
        return await this.findHighlightsUseCase.findHighlights();
    }
}
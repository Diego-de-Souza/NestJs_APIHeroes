import { Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IHighlightsRepository } from "../../ports/out/highlights.port";
import type { IFindHighlightsPort } from "../../ports/in/highlights/find-highlights.port";

@Injectable()
export class FindHighlightsUseCase implements IFindHighlightsPort {
    constructor(
        @Inject('IHighlightsRepository') private readonly highlightsRepository: IHighlightsRepository
    ) {}

    async execute(): Promise<ApiResponseInterface<unknown>> {
        const highlights = [];
        try{
            const [
                articlesLastWeek,
                games,
                eventsLast
            ] = await Promise.all([
                this.highlightsRepository.findArticlesFromLastWeek(),
                this.highlightsRepository.findTopPlayersByScore(),
                this.highlightsRepository.findUpcomingEventsThisMonth()
            ]);

            if(articlesLastWeek && articlesLastWeek.length > 0){
                const newHighlights = articlesLastWeek
                    .filter(item => item && item.title) // Filtra itens válidos
                    .map((item) => ({
                        title: item.title,
                        category: item.category
                    }));
                
                if (newHighlights.length > 0) {
                    highlights.push({label: "Artigos", items: newHighlights});
                }
            }

            if (games && games.length > 0) {
                type GameItem = { Game?: { name: string }; User?: { nickname: string }; lvl_user?: number; score?: number };
                const topGames = (games as GameItem[])
                    .filter((game: GameItem) => game?.Game?.name && game?.User?.nickname)
                    .map((game: GameItem) => ({
                        gameName: game.Game!.name,
                        playerNickname: game.User!.nickname,
                        level: game.lvl_user ?? 0,
                        score: game.score ?? 0,
                    }));
                if (topGames.length > 0) {
                    highlights.push({ label: "Games", items: topGames });
                }
            }

            if(eventsLast && eventsLast.length > 0){
                const upcomingEvents = eventsLast
                    .filter(event => event && event.title) // Filtra itens válidos
                    .map((event) => ({
                        title: event.title,
                        date_event: event.date_event,
                        description: event.description || ''
                    }));
                
                if (upcomingEvents.length > 0) {
                    highlights.push({label: "Eventos", items: upcomingEvents});
                }
            }


            if (highlights.length === 0) {
                return {
                    status: 200,
                    message: 'Nenhum destaque disponível no momento.',
                    data: []
                };
            }

            return {
                status: 200,
                message: 'Destaques encontrados com sucesso.',
                data: highlights
            };

        } catch (error: unknown) {
            const err = error as Error;
            return {
                status: 500,
                message: 'Erro inesperado ao buscar destaques.',
                error: (err?.message ?? String(error)),
            };
        }
    }
}
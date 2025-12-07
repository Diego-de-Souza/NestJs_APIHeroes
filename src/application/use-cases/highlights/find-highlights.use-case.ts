import { Injectable } from "@nestjs/common";
import { HighlightsRepository } from "../../../infrastructure/repositories/highlights.repository";


@Injectable()
export class FindHighlightsUseCase {
    constructor(
        private readonly highlightsRepository: HighlightsRepository,
    ) {}

    async findHighlights(): Promise<any> {
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

            if(games && games.length > 0){
                const topGames = games
                    .filter(game => {
                        // Verifica se o game e os relacionamentos existem
                        return game && 
                               game.Game && 
                               game.Game.name && 
                               game.User && 
                               game.User.nickname;
                    })
                    .map((game) => ({
                        gameName: game.Game.name,
                        playerNickname: game.User.nickname,
                        level: game.lvl_user || 0,
                        score: game.score || 0
                    }));
                
                if (topGames.length > 0) {
                    highlights.push({label: "Games", items: topGames});
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

        }catch(error){
            return {
                status: 500,
                message: 'Erro inesperado ao buscar destaques.',
                error: error.message || error,
            };
        }
    }
}
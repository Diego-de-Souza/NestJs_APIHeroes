import { Injectable } from "@nestjs/common";
import { ArticlesRepository } from "../../../infrastructure/repositories/articles.repository";


@Injectable()
export class FindArticlesForHomepageUseCase {
    constructor(
        private readonly articlesRepository: ArticlesRepository
    ) {}

    async articlesForHomepage(): Promise<any> {
        try{
            //destaques
            const latestArticles = await this.articlesRepository.findLatestArticles(3);
            //ultimos laçados
            const featuredArticles = await this.articlesRepository.findFeaturedArticles(3);
            //categorias
            const categories = await this.articlesRepository.findArticlesByCategory(3);
            return {
                status: 200,
                message: 'Artigos para homepage encontrados com sucesso.',
                data: {
                    latestArticles,
                    featuredArticles,
                    categories
                }
            };
        }catch(error){
            return{
                status: 500,
                message: 'Erro inesperado ao buscar Artigos para homepage.',
                error: error.message || error,
            };
        }
    }
}
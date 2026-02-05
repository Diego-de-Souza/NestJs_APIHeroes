import { Article } from '../../../infrastructure/database/sequelize/models/article.model';
import { Events } from '../../../infrastructure/database/sequelize/models/index.model';

/** Port OUT: contrato do repositório de destaques. UseCase → Port → Repository. */
export interface IHighlightsRepository {
  findArticlesFromLastWeek(): Promise<Article[]>;
  findTopPlayersByScore(): Promise<unknown[]>;
  findUpcomingEventsThisMonth(): Promise<Events[]>;
}

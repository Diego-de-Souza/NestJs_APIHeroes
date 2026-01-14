import { HttpStatus, Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { ArticlesRepository } from '../../../infrastructure/repositories/articles.repository';
import { SearchArticlesDto } from '../../../interface/dtos/articles/search-articles.dto';
import { Article } from '../../../infrastructure/database/sequelize/models/article.model';
import { Op } from 'sequelize';

@Injectable()
export class SearchArticlesUseCase {
  private readonly logger = new Logger(SearchArticlesUseCase.name);

  constructor(
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  async execute(searchDto: SearchArticlesDto): Promise<ApiResponseInterface<Article>> {
    try {
      const { Article } = await import('../../../infrastructure/database/sequelize/models/article.model');
      
      const where: any = {};
      const order: any = [];

      // Filtro por query (full-text search)
      if (searchDto.query) {
        // Usar busca full-text do PostgreSQL
        where[Op.or] = [
          { title: { [Op.iLike]: `%${searchDto.query}%` } },
          { description: { [Op.iLike]: `%${searchDto.query}%` } },
          { text: { [Op.iLike]: `%${searchDto.query}%` } },
        ];
      }

      // Filtros adicionais
      if (searchDto.category) {
        where.category = searchDto.category;
      }

      if (searchDto.author) {
        where.author = { [Op.iLike]: `%${searchDto.author}%` };
      }

      if (searchDto.tags && searchDto.tags.length > 0) {
        where.keyWords = { [Op.contains]: searchDto.tags };
      }

      if (searchDto.dateFrom || searchDto.dateTo) {
        where.created_at = {};
        if (searchDto.dateFrom) {
          where.created_at[Op.gte] = new Date(searchDto.dateFrom);
        }
        if (searchDto.dateTo) {
          where.created_at[Op.lte] = new Date(searchDto.dateTo);
        }
      }

      // Ordenação
      switch (searchDto.sortBy) {
        case 'oldest':
          order.push(['created_at', 'ASC']);
          break;
        case 'mostViewed':
          order.push(['views', 'DESC']);
          break;
        case 'relevance':
          // Manter ordem padrão (relevância do full-text search)
          if (searchDto.query) {
            order.push(['created_at', 'DESC']);
          } else {
            order.push(['created_at', 'DESC']);
          }
          break;
        case 'newest':
        default:
          order.push(['created_at', 'DESC']);
          break;
      }

      const limit = searchDto.limit || 20;
      const offset = searchDto.offset || 0;

      // Buscar artigos
      const articles = await Article.findAll({
        where,
        order,
        limit,
        offset,
      });

      // Contar total
      const total = await Article.count({ where });

      return {
        status: HttpStatus.OK,
        message: 'Artigos encontrados com sucesso',
        data: articles as any,
        dataUnit: { total, query: searchDto.query, filters: searchDto } as any,
      };
    } catch (error) {
      this.logger.error('Erro ao buscar artigos:', error);
      throw new InternalServerErrorException('Erro ao buscar artigos');
    }
  }
}

import { HttpStatus, Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { ArticlesRepository } from '../../../infrastructure/repositories/articles.repository';
import { SearchSuggestionsDto } from '../../../interface/dtos/articles/search-suggestions.dto';
import { Article } from '../../../infrastructure/database/sequelize/models/article.model';
import { Op, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { InjectConnection } from '@nestjs/sequelize';

@Injectable()
export class SearchSuggestionsUseCase {
  private readonly logger = new Logger(SearchSuggestionsUseCase.name);

  constructor(
    private readonly articlesRepository: ArticlesRepository,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async execute(dto: SearchSuggestionsDto): Promise<ApiResponseInterface<string>> {
    try {
      const limit = dto.limit || 5;
      
      // Buscar sugestões baseadas nos títulos dos artigos
      const results = await this.sequelize.query(`
        SELECT DISTINCT title 
        FROM articles 
        WHERE title ILIKE :query 
        LIMIT :limit
      `, {
        replacements: { query: `%${dto.query}%`, limit },
        type: QueryTypes.SELECT,
      }) as any[];

      const titles = results.map((s: any) => s.title).filter(Boolean);

      return {
        status: HttpStatus.OK,
        message: 'Sugestões encontradas com sucesso',
        data: titles as any,
      };
    } catch (error) {
      this.logger.error('Erro ao buscar sugestões:', error);
      throw new InternalServerErrorException('Erro ao buscar sugestões');
    }
  }
}

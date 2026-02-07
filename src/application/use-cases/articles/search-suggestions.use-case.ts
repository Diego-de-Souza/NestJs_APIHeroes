import { HttpStatus, Injectable, Logger, InternalServerErrorException, Inject } from '@nestjs/common';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { SearchSuggestionsDto } from '../../../interface/dtos/articles/search-suggestions.dto';
import type { IGetSearchSuggestionsPort } from '../../ports/in/article/get-search-suggestions.port';
import type { IArticlePort } from '../../ports/out/article.port';

@Injectable()
export class SearchSuggestionsUseCase implements IGetSearchSuggestionsPort {
  private readonly logger = new Logger(SearchSuggestionsUseCase.name);

  constructor(
    @Inject('IArticlePort') private readonly articleRepository: IArticlePort
  ) {}

  async execute(dto: SearchSuggestionsDto): Promise<ApiResponseInterface<string>> {
    try {
      const limit = dto.limit || 5;
      
      // Buscar sugestões baseadas nos títulos dos artigos
      const results = await this.articleRepository.getSearchSuggestions(dto, limit);
      
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

import { IsOptional, IsString, IsArray, IsEnum, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum ArticleSortBy {
  RELEVANCE = 'relevance',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_VIEWED = 'mostViewed',
}

export class SearchArticlesDto {
  @IsOptional()
  @IsString({ message: 'query deve ser uma string' })
  query?: string;

  @IsOptional()
  @IsString({ message: 'category deve ser uma string' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'author deve ser uma string' })
  author?: string;

  @IsOptional()
  @IsArray({ message: 'tags deve ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags?: string[];

  @IsOptional()
  @IsDateString({}, { message: 'dateFrom deve ser uma data válida (ISO 8601)' })
  dateFrom?: string;

  @IsOptional()
  @IsDateString({}, { message: 'dateTo deve ser uma data válida (ISO 8601)' })
  dateTo?: string;

  @IsOptional()
  @IsEnum(ArticleSortBy, { message: 'sortBy deve ser: relevance, newest, oldest ou mostViewed' })
  sortBy?: ArticleSortBy;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit deve ser um número inteiro' })
  @Min(1, { message: 'limit deve ser no mínimo 1' })
  @Max(100, { message: 'limit deve ser no máximo 100' })
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'offset deve ser um número inteiro' })
  @Min(0, { message: 'offset deve ser no mínimo 0' })
  offset?: number;
}

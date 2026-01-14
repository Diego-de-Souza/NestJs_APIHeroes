import { IsOptional, IsInt, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum CommentSortBy {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_LIKED = 'mostLiked',
}

export class CommentFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'articleId deve ser um número inteiro' })
  articleId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'userId deve ser um número inteiro' })
  userId?: number;

  @IsOptional()
  @IsEnum(CommentSortBy, { message: 'sortBy deve ser: newest, oldest ou mostLiked' })
  sortBy?: CommentSortBy;

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

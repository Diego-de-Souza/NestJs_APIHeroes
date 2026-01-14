import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchSuggestionsDto {
  @IsString({ message: 'query deve ser uma string' })
  @IsNotEmpty({ message: 'query é obrigatório' })
  query: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit deve ser um número inteiro' })
  @Min(1, { message: 'limit deve ser no mínimo 1' })
  @Max(20, { message: 'limit deve ser no máximo 20' })
  limit?: number;
}

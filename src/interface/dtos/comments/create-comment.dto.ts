import { IsNotEmpty, IsString, IsInt, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @IsString({ message: 'articleId deve ser uma string' })
  @IsNotEmpty({ message: 'articleId é obrigatório' })
  @Transform(({ value }) => (value != null && value !== '' ? String(value) : undefined))
  articleId: string;

  @IsString({ message: 'content deve ser uma string' })
  @IsNotEmpty({ message: 'content é obrigatório' })
  @MinLength(3, { message: 'O comentário deve ter no mínimo 3 caracteres' })
  @MaxLength(1000, { message: 'O comentário deve ter no máximo 1000 caracteres' })
  content: string;

  @IsInt({ message: 'parentId deve ser um número inteiro' })
  @IsOptional()
  @Transform(({ value }) => (value != null && value !== '' ? String(value) : undefined))
  parentId?: string | null;
}

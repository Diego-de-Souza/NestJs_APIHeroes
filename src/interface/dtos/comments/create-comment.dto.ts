import { IsNotEmpty, IsString, IsInt, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @IsInt({ message: 'articleId deve ser um número inteiro' })
  @IsNotEmpty({ message: 'articleId é obrigatório' })
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
  articleId: number;

  @IsString({ message: 'content deve ser uma string' })
  @IsNotEmpty({ message: 'content é obrigatório' })
  @MinLength(3, { message: 'O comentário deve ter no mínimo 3 caracteres' })
  @MaxLength(1000, { message: 'O comentário deve ter no máximo 1000 caracteres' })
  content: string;

  @IsInt({ message: 'parentId deve ser um número inteiro' })
  @IsOptional()
  @Transform(({ value }) => value ? (typeof value === 'string' ? parseInt(value, 10) : value) : null)
  parentId?: number | null;
}

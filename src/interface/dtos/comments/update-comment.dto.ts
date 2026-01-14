import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString({ message: 'content deve ser uma string' })
  @IsNotEmpty({ message: 'content é obrigatório' })
  @MinLength(3, { message: 'O comentário deve ter no mínimo 3 caracteres' })
  @MaxLength(1000, { message: 'O comentário deve ter no máximo 1000 caracteres' })
  content: string;
}

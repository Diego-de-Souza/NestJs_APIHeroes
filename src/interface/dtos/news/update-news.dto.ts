import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional,
    IsInt,
    MinLength
} from "class-validator";

export class UpdateNewsDto {
    @IsOptional()
    @IsString({ message: "Título deve ser string" })
    @MinLength(5, { message: "Título deve ter no mínimo 5 caracteres" })
    @MaxLength(100, { message: "Título deve conter menos de 100 caracteres" })
    readonly title?: string;

    @IsOptional()
    @IsString({ message: "Descrição deve ser string" })
    readonly description?: string;

    @IsOptional()
    @IsString({ message: "Conteúdo deve ser string" })
    readonly content?: string;

    @IsOptional()
    @IsString({ message: "Tipo de newsletter deve ser string" })
    @MaxLength(50, { message: "Tipo de newsletter deve conter menos de 50 caracteres" })
    readonly type_news_letter?: string;

    @IsOptional()
    @IsString({ message: "Tema deve ser string" })
    @MaxLength(50, { message: "Tema deve conter menos de 50 caracteres" })
    readonly theme?: string;

    @IsInt({ message: "Usuario ID deve ser um número inteiro" })
    @IsNotEmpty({ message: "Usuario ID é obrigatório" })
    readonly usuario_id: number;
}

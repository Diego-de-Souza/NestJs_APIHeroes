import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional,
    IsInt,
    MinLength
} from "class-validator";

export class CreateNewsDto {
    @IsString({ message: "Título deve ser string" })
    @IsNotEmpty({ message: "Título não pode estar vazio" })
    @MinLength(5, { message: "Título deve ter no mínimo 5 caracteres" })
    @MaxLength(100, { message: "Título deve conter menos de 100 caracteres" })
    readonly title: string;

    @IsString({ message: "Descrição deve ser string" })
    @IsNotEmpty({ message: "Descrição não pode estar vazia" })
    readonly description: string;

    @IsString({ message: "Conteúdo deve ser string" })
    @IsNotEmpty({ message: "Conteúdo não pode estar vazio" })
    readonly content: string;

    @IsString({ message: "Tipo de newsletter deve ser string" })
    @IsNotEmpty({ message: "Tipo de newsletter não pode estar vazio" })
    @MaxLength(50, { message: "Tipo de newsletter deve conter menos de 50 caracteres" })
    readonly type_news_letter: string;

    @IsString({ message: "Tema deve ser string" })
    @IsNotEmpty({ message: "Tema não pode estar vazio" })
    @MaxLength(50, { message: "Tema deve conter menos de 50 caracteres" })
    readonly theme: string;

    @IsInt({ message: "Usuario ID deve ser um número inteiro" })
    @IsNotEmpty({ message: "Usuario ID é obrigatório" })
    readonly usuario_id: number;

    @IsOptional()
    @IsInt({ message: "Role do artigo deve ser um número inteiro (1:root, 2:admin, 3:client)" })
    readonly role_art?: number;
}

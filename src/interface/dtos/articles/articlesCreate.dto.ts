import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsArray,
    IsOptional,
    IsInt,
    IsUrl,
    IsObject,
    ValidateIf
} from "class-validator";

export class CreateArticleDto {
    @IsString({ message: "Categoria deve ser string" })
    @IsNotEmpty({ message: "Categoria não pode estar vazia" })
    @MaxLength(50, { message: "Categoria deve conter menos de 50 caracteres" })
    readonly category: string;

    @IsString({ message: "Título deve ser string" })
    @IsNotEmpty({ message: "Título não pode estar vazio" })
    @MaxLength(100, { message: "Título deve conter menos de 100 caracteres" })
    readonly title: string;

    @IsString({ message: "Descrição deve ser string" })
    @IsNotEmpty({ message: "Descrição não pode estar vazia" })
    readonly description: string;

    @IsString({ message: "Texto deve ser string" })
    @IsNotEmpty({ message: "Texto não pode estar vazio" })
    readonly text: string;

    @IsArray({ message: "Resumo deve ser um array" })
    @IsNotEmpty({ message: "Resumo não pode estar vazio" })
    readonly summary: object[];

    @IsOptional()
    @IsString({ message: "Thumbnail deve ser string" })
    readonly thumbnail?: string;

    @IsArray({ message: "Palavras-chave devem ser um array" })
    @IsNotEmpty({ message: "Palavras-chave não podem estar vazias" })
    readonly keyWords: string[];

    @IsOptional()
    @IsString({ message: "Rota deve ser string" })
    readonly route?: string;

    @IsOptional()
    @IsInt({ message: "Views deve ser um número inteiro" })
    readonly views?: number;

    @IsOptional()
    @IsString({ message: "Tema deve ser string" })
    readonly theme?: string;

    @IsOptional()
    @IsString({ message: "Cor do tema deve ser string" })
    readonly themeColor?: string;

    @ValidateIf(o => o.image !== undefined)
    @IsString({ message: "Imagem deve ser uma string base64" })
    readonly image?: string;

    @IsOptional()
    @IsString({ message: "Autor deve ser string" })
    @MaxLength(50, { message: "Autor deve conter menos de 50 caracteres" })
    readonly author: string;

    @IsOptional()
    @IsInt({ message: "Usuario ID deve ser um número inteiro" })
    readonly usuario_id?: number;

    @IsOptional()
    @IsInt({ message: "Role do artigo deve ser um número inteiro (1:root, 2:admin, 3:client)" })
    readonly role_art?: number;
}
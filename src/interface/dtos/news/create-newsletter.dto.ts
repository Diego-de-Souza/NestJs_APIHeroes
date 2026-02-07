import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { NewsletterInterface } from "../../../domain/interfaces/newsletter.interface";

export class CreateNewsletterDto implements NewsletterInterface{
    @IsString({ message: "Título deve ser string" })
    @IsNotEmpty({ message: "Título não pode estar vazio" })
    @MinLength(5, { message: "Título deve ter no mínimo 5 caracteres" })
    @MaxLength(100, { message: "Título deve conter menos de 100 caracteres" })
    readonly title: string;

    @IsString({ message: "Descrição deve ser string" })
    @IsNotEmpty({ message: "Descrição não pode estar vazia" })
    readonly description: string;

    @IsString({ message: "Imagem deve ser string" })
    readonly image?: string;

    @IsString({ message: "Link deve ser string" })
    @IsNotEmpty({ message: "Link não pode estar vazio" })
    readonly link: string;

    @IsString({ message: "Categoria deve ser string" })
    @IsNotEmpty({ message: "Categoria não pode estar vazia" })
    @MaxLength(50, { message: "Categoria deve conter menos de 50 caracteres" })
    readonly category: string;

    @IsString({ message: "Data deve ser string" })
    @IsNotEmpty({ message: "Data não pode estar vazia" })
    readonly date: string;

    @IsString({ message: "Tempo de leitura deve ser string" })
    @IsNotEmpty({ message: "Tempo de leitura não pode estar vazio" })
    readonly read_time: string;

    @IsString({ message: "Autor deve ser string" })
    @IsNotEmpty({ message: "Autor não pode estar vazio" })
    readonly author: string;
    
    @IsString({ message: "Usuário deve ser string" })
    @IsNotEmpty({ message: "Usuário não pode estar vazio" })
    readonly usuario_id: string;

}
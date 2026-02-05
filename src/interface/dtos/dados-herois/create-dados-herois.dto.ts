import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, MinDate, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateDadosHeroisDto {
    @ApiProperty()
    @IsString({message: "nome deve ser string"})
    @MinLength(2, {message: "nome deve Conter mais de dois caracteres"})
    readonly name: string;

    @ApiProperty()
    @IsString({ message: "estudio deve ser uma string" })
    @IsNotEmpty({message: "estudio não pode estar vazio"})
    readonly studio_id: string;

    @ApiProperty()
    @IsString({message: "Tipo de poder deve ser string"})
    @MinLength(2, {message: "Tipo de poder deve Conter mais de dois caracteres"})
    @IsNotEmpty({message: "Tipo de poder não pode estar vazio"})
    readonly power_type : string;

    @ApiProperty()
    @IsString({message: "moralidade deve ser string"})
    @MinLength(2, {message: "moralidade deve Conter mais de dois caracteres"})
    @IsNotEmpty({message: "moralidade não pode estar vazio"})
    readonly morality : string;

    @ApiProperty()
    @IsString({message: "Primeira Aparicao deve ser string"})
    @MinLength(2, {message: "Primeira Aparicao deve Conter mais de dois caracteres"})
    @IsNotEmpty({message: "Primeira Aparicao não pode estar vazio"})
    readonly first_appearance :  string;

    @ApiProperty()
    @IsDate()
    @MinDate(new Date("1753-01-01"), { message: "Valor inválido, escolha uma data futura" })
    @Transform(({ value }) => {
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
    })
    readonly release_date: Date;


    @ApiProperty()
    @IsString({message: "criador deve ser string"})
    @MinLength(2, {message: "criador deve Conter mais de dois caracteres"})
    @IsNotEmpty({message: "criador não pode estar vazio"})
    readonly creator : string;

    @ApiProperty()
    @IsString({message: "fraquesa deve ser string"})
    @MinLength(2, {message: "fraquesa deve Conter mais de dois caracteres"})
    @IsNotEmpty({message: "fraquesa não pode estar vazio"})
    readonly weak_point : string;

    @ApiProperty()
    @IsString({message: "afiliacao deve ser string"})
    @MinLength(2, {message: "afiliacao deve Conter mais de dois caracteres"})
    @IsNotEmpty({message: "afiliacao não pode estar vazio"})
    readonly affiliation : string;

    @ApiProperty()
    @IsString({message: "historia deve ser string"})
    @IsNotEmpty({message: "historia não pode estar vazio"})
    readonly story : string;

    @ApiProperty()
    @IsString({ message: "Time deve ser uma string" })
    @IsNotEmpty({message: "Time não pode estar vazio"})
    readonly team_id: string;

    @ApiProperty()
    @IsString({message: "genero deve ser string"})
    @MinLength(2, {message: "genero deve Conter mais de vinte caracteres"})
    @IsNotEmpty({message: "genero não pode estar vazio"})
    readonly genre : string;

    // variaveis para salvar as imagens (recebe Buffer do upload ou URL string do body)
    @ApiProperty({ required: false })
    @IsOptional()
    image1?: Buffer | string;

    @ApiProperty({ required: false })
    @IsOptional()
    image2?: Buffer | string;

}

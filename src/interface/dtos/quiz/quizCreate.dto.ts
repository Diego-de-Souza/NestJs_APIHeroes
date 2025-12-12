import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsString, MaxLength, ValidateNested, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export class QuizLevelDto {
    @IsString({ message: "O nome do nível deve ser string" })
    @IsNotEmpty({ message: "O nome do nível não pode estar vazio" })
    @MaxLength(100, { message: "O nome do nível deve ter no máximo 100 caracteres" })
    name_quiz_level: string;

    @IsInt({ message: "questions_count deve ser inteiro" })
    @Min(1, { message: "questions_count deve ser maior que zero" })
    questions_count: number;

    @IsInt({ message: "xp_reward deve ser inteiro" })
    @Min(100, { message: "xp_reward deve ser no mínimo 100" })
    xp_reward: number;

    @IsString({ message: "A dificuldade deve ser string" })
    @IsNotEmpty({ message: "dificuldade não pode estar vazio" }) 
    @MaxLength(20, { message: "dificuldade deve conter menos de 20 caracteres" })
    readonly difficulty: string;
}

export class CreateQuizDto {
    @IsString({ message: "O nome deve ser string" })
    @IsNotEmpty({ message: "O nome não pode estar vazio" }) 
    @MaxLength(100, { message: "Nome deve conter menos de 100 caracteres" })
    readonly name: string;

    @IsArray({ message: "O quiz_levels deve ser um array" })
    @ArrayNotEmpty({ message: "O array não pode ser vazio" })
    @ArrayMaxSize(10, { message: "O quiz_levels deve ter no máximo 10 níveis" })
    @ValidateNested({ each: true })
    @Type(() => QuizLevelDto)
    readonly quiz_levels: QuizLevelDto[];

    @IsString({ message: "tema deve ser string" })
    @MaxLength(50, { message: "tema deve conter menos de 50 caracteres" })
    readonly theme: string;

    @IsString({ message: "url_logo deve ser string" })
    @MaxLength(255, { message: "url_logo deve conter menos de 255 caracteres" })
    readonly url_logo: string;
}
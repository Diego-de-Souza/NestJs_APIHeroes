import { IsArray, IsInt, IsNotEmpty, IsString, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";

export class AnswerDto {
    @IsString({ message: "questionId deve ser uma string" })
    @IsNotEmpty({ message: "questionId não pode estar vazio" })
    readonly questionId: string;

    @IsString({ message: "selected deve ser string" })
    @IsNotEmpty({ message: "selected não pode estar vazio" })
    readonly selected: string;
}

export class AnswerQuizDto {
    @IsString({ message: "user_id deve ser uma string" })
    @IsNotEmpty({ message: "user_id não pode estar vazio" })
    readonly user_id: string;

    @IsString({ message: "quiz_level_id deve ser uma string" })
    @IsNotEmpty({ message: "quiz_level_id não pode estar vazio" })
    readonly quiz_level_id: string;

    @IsArray({ message: "answers deve ser um array" })
    @ArrayMinSize(1, { message: "Deve ter no mínimo 1 resposta" })
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    readonly answers: AnswerDto[];
}


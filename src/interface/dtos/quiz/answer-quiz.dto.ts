import { IsArray, IsInt, IsNotEmpty, IsString, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";

export class AnswerDto {
    @IsInt({ message: "questionId deve ser inteiro" })
    @IsNotEmpty({ message: "questionId não pode estar vazio" })
    readonly questionId: number;

    @IsString({ message: "selected deve ser string" })
    @IsNotEmpty({ message: "selected não pode estar vazio" })
    readonly selected: string;
}

export class AnswerQuizDto {
    @IsInt({ message: "user_id deve ser inteiro" })
    @IsNotEmpty({ message: "user_id não pode estar vazio" })
    readonly user_id: number;

    @IsInt({ message: "quiz_level_id deve ser inteiro" })
    @IsNotEmpty({ message: "quiz_level_id não pode estar vazio" })
    readonly quiz_level_id: number;

    @IsArray({ message: "answers deve ser um array" })
    @ArrayMinSize(1, { message: "Deve ter no mínimo 1 resposta" })
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    readonly answers: AnswerDto[];
}


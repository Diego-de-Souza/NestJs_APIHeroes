import { IsArray, IsInt, IsNotEmpty, IsString, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";

export class QuestionOptionDto {
    @IsString({ message: "Opção deve ser string" })
    @IsNotEmpty({ message: "Opção não pode estar vazia" })
    readonly option: string;
}

export class QuestionDto {
    @IsString({ message: "Pergunta deve ser string" })
    @IsNotEmpty({ message: "Pergunta não pode estar vazia" })
    readonly question: string;

    @IsString({ message: "Resposta deve ser string" })
    @IsNotEmpty({ message: "Resposta não pode estar vazia" })
    readonly answer: string;

    @IsArray({ message: "Opções deve ser um array" })
    @ArrayMinSize(2, { message: "Deve ter no mínimo 2 opções" })
    @ValidateNested({ each: true })
    @Type(() => QuestionOptionDto)
    readonly options: QuestionOptionDto[];
}

export class CreateQuestionsDto {
    @IsInt({ message: "quiz_level_id deve ser inteiro" })
    @IsNotEmpty({ message: "quiz_level_id não pode estar vazio" })
    readonly quiz_level_id: number;

    @IsArray({ message: "questions deve ser um array" })
    @ArrayMinSize(1, { message: "Deve ter no mínimo 1 pergunta" })
    @ValidateNested({ each: true })
    @Type(() => QuestionDto)
    readonly questions: QuestionDto[];
}


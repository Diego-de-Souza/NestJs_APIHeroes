import { IsArray, IsInt, IsNotEmpty, IsString, ValidateNested, ArrayMinSize, IsOptional } from "class-validator";
import { Type, Transform } from "class-transformer";

export class QuestionDto {
    @IsString({ message: "Pergunta deve ser string" })
    @IsNotEmpty({ message: "Pergunta não pode estar vazia" })
    readonly question: string;

    @IsString({ message: "Resposta deve ser string" })
    @IsNotEmpty({ message: "Resposta não pode estar vazia" })
    readonly answer: string;

    @IsArray({ message: "Opções deve ser um array" })
    @ArrayMinSize(2, { message: "Deve ter no mínimo 2 opções" })
    @IsString({ each: true, message: "Cada opção deve ser uma string" })
    readonly options: string[];
}

export class CreateQuestionsDto {
    @IsOptional()
    @IsInt({ message: "quiz_id deve ser inteiro" })
    @Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return undefined;
        return typeof value === 'string' ? parseInt(value, 10) : value;
    })
    readonly quiz_id?: number;

    @IsInt({ message: "quiz_level_id deve ser inteiro" })
    @IsNotEmpty({ message: "quiz_level_id não pode estar vazio" })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return parseInt(value, 10);
        }
        return value;
    })
    readonly quiz_level_id: number;

    @IsArray({ message: "questions deve ser um array" })
    @ArrayMinSize(1, { message: "Deve ter no mínimo 1 pergunta" })
    @ValidateNested({ each: true })
    @Type(() => QuestionDto)
    readonly questions: QuestionDto[];
}


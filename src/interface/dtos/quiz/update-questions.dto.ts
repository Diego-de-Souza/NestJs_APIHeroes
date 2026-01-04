import { IsArray, IsInt, IsNotEmpty, IsString, ValidateNested, ArrayMinSize, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { QuestionDto } from "./create-questions.dto";

export class UpdateQuestionDto extends PartialType(QuestionDto) {
    @IsInt({ message: "quiz_level_id deve ser inteiro" })
    @IsNotEmpty({ message: "quiz_level_id não pode estar vazio" })
    readonly quiz_level_id: number;

    @IsInt({ message: "question_number deve ser inteiro" })
    @IsOptional()
    readonly question_number?: number;
}

export class UpdateQuestionsDto {
    @IsArray({ message: "questions deve ser um array" })
    @ArrayMinSize(1, { message: "Deve ter no mínimo 1 pergunta" })
    @ValidateNested({ each: true })
    @Type(() => UpdateQuestionDto)
    readonly questions: UpdateQuestionDto[];
}


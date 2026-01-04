import { IsString, IsOptional, IsArray, ValidateNested, IsInt, IsBoolean, Min, MaxLength } from "class-validator";
import { Type } from "class-transformer";
import { PartialType, OmitType } from "@nestjs/mapped-types";
import { CreateQuizDto, QuizLevelDto } from "./quizCreate.dto";

export class UpdateQuizLevelDto extends PartialType(QuizLevelDto) {
    @IsInt({ message: "id deve ser inteiro" })
    @IsOptional()
    readonly id?: number;

    @IsBoolean({ message: "unlocked deve ser boolean" })
    @IsOptional()
    readonly unlocked?: boolean;
}

export class UpdateQuizDto extends OmitType(PartialType(CreateQuizDto), ['quiz_levels'] as const) {
    @IsString({ message: "name deve ser string" })
    @IsOptional()
    @MaxLength(100, { message: "Nome deve conter menos de 100 caracteres" })
    readonly name?: string;

    @IsString({ message: "theme deve ser string" })
    @IsOptional()
    @MaxLength(50, { message: "tema deve conter menos de 50 caracteres" })
    readonly theme?: string;

    @IsString({ message: "url_logo deve ser string" })
    @IsOptional()
    @MaxLength(255, { message: "url_logo deve conter menos de 255 caracteres" })
    readonly url_logo?: string;

    @IsArray({ message: "quiz_levels deve ser um array" })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateQuizLevelDto)
    readonly quiz_levels?: UpdateQuizLevelDto[];
}


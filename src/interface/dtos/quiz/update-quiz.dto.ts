import { IsString, IsOptional, IsArray, ValidateNested, IsInt, IsBoolean, Min } from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { CreateQuizDto, QuizLevelDto } from "./quizCreate.dto";

export class UpdateQuizLevelDto extends PartialType(QuizLevelDto) {
    @IsInt({ message: "id deve ser inteiro" })
    @IsOptional()
    readonly id?: number;

    @IsBoolean({ message: "unlocked deve ser boolean" })
    @IsOptional()
    readonly unlocked?: boolean;
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {
    @IsString({ message: "name deve ser string" })
    @IsOptional()
    readonly name?: string;

    @IsString({ message: "theme deve ser string" })
    @IsOptional()
    readonly theme?: string;

    @IsArray({ message: "quiz_levels deve ser um array" })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateQuizLevelDto)
    readonly quiz_levels?: UpdateQuizLevelDto[];
}


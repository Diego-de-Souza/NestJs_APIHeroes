import {
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
    IsInt,
    IsString
} from "class-validator";

export class DeleteManyArticlesDto {
    @IsArray({ message: "IDs deve ser um array" })
    @IsNotEmpty({ message: "IDs não pode estar vazio" })
    @ArrayMinSize(1, { message: "Deve haver pelo menos um ID" })
    @IsString({ each: true, message: "Cada ID deve ser uma string" })
    readonly ids: string[];
}

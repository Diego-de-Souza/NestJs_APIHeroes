import {
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
    IsInt
} from "class-validator";

export class DeleteManyArticlesDto {
    @IsArray({ message: "IDs deve ser um array" })
    @IsNotEmpty({ message: "IDs não pode estar vazio" })
    @ArrayMinSize(1, { message: "Deve haver pelo menos um ID" })
    @IsInt({ each: true, message: "Cada ID deve ser um número inteiro" })
    readonly ids: number[];
}

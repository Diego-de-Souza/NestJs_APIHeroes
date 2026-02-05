import {
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
    IsUUID
} from "class-validator";

export class DeleteManyNewsDto {
    @IsArray({ message: "IDs deve ser um array" })
    @IsNotEmpty({ message: "IDs não pode estar vazio" })
    @ArrayMinSize(1, { message: "Deve haver pelo menos um ID" })
    @IsUUID('4', { each: true, message: "Cada ID deve ser um UUID válido" })
    readonly ids: string[];
}

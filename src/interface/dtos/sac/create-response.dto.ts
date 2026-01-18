import {
    IsNotEmpty,
    IsString,
    MinLength
} from "class-validator";

export class CreateResponseDto {
    @IsString({ message: "Mensagem deve ser string" })
    @IsNotEmpty({ message: "Mensagem é obrigatória" })
    @MinLength(1, { message: "Mensagem não pode estar vazia" })
    readonly message: string;
}

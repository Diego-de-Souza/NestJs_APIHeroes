import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    IsOptional,
    IsIn
} from "class-validator";

export class CreateContactDto {
    @IsString({ message: "Tipo deve ser string" })
    @IsNotEmpty({ message: "Tipo é obrigatório" })
    @IsIn(['suporte', 'reclamacao', 'elogio'], {
        message: "Tipo deve ser: suporte, reclamacao ou elogio"
    })
    readonly type: 'suporte' | 'reclamacao' | 'elogio';

    @IsString({ message: "Assunto deve ser string" })
    @IsNotEmpty({ message: "Assunto é obrigatório" })
    @MinLength(5, { message: "Assunto deve ter no mínimo 5 caracteres" })
    @MaxLength(200, { message: "Assunto deve conter no máximo 200 caracteres" })
    readonly subject: string;

    @IsString({ message: "Mensagem deve ser string" })
    @IsNotEmpty({ message: "Mensagem é obrigatória" })
    @MinLength(10, { message: "Mensagem deve ter no mínimo 10 caracteres" })
    @MaxLength(5000, { message: "Mensagem deve conter no máximo 5000 caracteres" })
    readonly message: string;

    @IsOptional()
    @IsString({ message: "Prioridade deve ser string" })
    @IsIn(['low', 'normal', 'high', 'urgent'], {
        message: "Prioridade deve ser: low, normal, high ou urgent"
    })
    readonly priority?: 'low' | 'normal' | 'high' | 'urgent';

    @IsOptional()
    @IsString()
    readonly usuario_id?: string;
}

import {
    IsNotEmpty,
    IsString,
    IsIn
} from "class-validator";

export class UpdateStatusDto {
    @IsString({ message: "Status deve ser string" })
    @IsNotEmpty({ message: "Status é obrigatório" })
    @IsIn(['aberto', 'em_andamento', 'resolvido', 'fechado'], {
        message: "Status deve ser: aberto, em_andamento, resolvido ou fechado"
    })
    readonly status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
}

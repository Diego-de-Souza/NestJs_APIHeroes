import {
    IsOptional,
    IsString,
    IsInt,
    Min,
    IsIn,
    IsDateString
} from "class-validator";
import { Type } from "class-transformer";

export class FilterContactsDto {
    @IsOptional()
    @IsString({ message: "Usuario ID deve ser uma string (UUID)" })
    readonly usuario_id?: string;

    @IsOptional()
    @IsString({ message: "Tipo deve ser string" })
    @IsIn(['suporte', 'reclamacao', 'elogio'], {
        message: "Tipo deve ser: suporte, reclamacao ou elogio"
    })
    readonly type?: 'suporte' | 'reclamacao' | 'elogio';

    @IsOptional()
    @IsString({ message: "Status deve ser string" })
    @IsIn(['aberto', 'em_andamento', 'resolvido', 'fechado'], {
        message: "Status deve ser: aberto, em_andamento, resolvido ou fechado"
    })
    readonly status?: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';

    @IsOptional()
    @IsString({ message: "Prioridade deve ser string" })
    @IsIn(['low', 'normal', 'high', 'urgent'], {
        message: "Prioridade deve ser: low, normal, high ou urgent"
    })
    readonly priority?: 'low' | 'normal' | 'high' | 'urgent';

    @IsOptional()
    @IsString({ message: "Busca deve ser string" })
    readonly search?: string;

    @IsOptional()
    @IsDateString({}, { message: "Data inicial deve estar no formato YYYY-MM-DD" })
    readonly date_from?: string;

    @IsOptional()
    @IsDateString({}, { message: "Data final deve estar no formato YYYY-MM-DD" })
    readonly date_to?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "Página deve ser um número inteiro" })
    @Min(1, { message: "Página deve ser maior que 0" })
    readonly page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "Limite deve ser um número inteiro" })
    @Min(1, { message: "Limite deve ser maior que 0" })
    readonly limit?: number;
}

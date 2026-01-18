import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional,
    IsInt,
    IsIn
} from "class-validator";

export class CreateNotificationDto {
    @IsInt({ message: "Usuario ID deve ser um número inteiro" })
    @IsNotEmpty({ message: "Usuario ID é obrigatório" })
    readonly usuario_id: number;

    @IsString({ message: "Título deve ser string" })
    @IsNotEmpty({ message: "Título não pode estar vazio" })
    @MaxLength(200, { message: "Título deve conter no máximo 200 caracteres" })
    readonly title: string;

    @IsString({ message: "Mensagem deve ser string" })
    @IsNotEmpty({ message: "Mensagem não pode estar vazia" })
    @MaxLength(5000, { message: "Mensagem deve conter no máximo 5000 caracteres" })
    readonly message: string;

    @IsOptional()
    @IsString({ message: "Imagem deve ser string (URL)" })
    @MaxLength(500, { message: "URL da imagem deve conter no máximo 500 caracteres" })
    readonly image?: string | null;

    @IsOptional()
    @IsString({ message: "Autor deve ser string" })
    @MaxLength(100, { message: "Autor deve conter no máximo 100 caracteres" })
    readonly author?: string;

    @IsOptional()
    @IsString({ message: "Tipo deve ser string" })
    @IsIn(['info', 'success', 'warning', 'error', 'system'], {
        message: "Tipo deve ser: info, success, warning, error ou system"
    })
    readonly type?: 'info' | 'success' | 'warning' | 'error' | 'system';
}

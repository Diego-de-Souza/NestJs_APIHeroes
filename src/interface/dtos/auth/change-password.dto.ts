import { IsNotEmpty, IsString } from "class-validator";


export class ChangePasswordDto {
    @IsString({message: "Senha deve ser string"})
    @IsNotEmpty({message: "Senha não pode estar vazia"})
    newPassword: string;

    @IsString({message: "ID deve ser string"})
    @IsNotEmpty({message: "ID não pode estar vazio"})
    id: string;
}
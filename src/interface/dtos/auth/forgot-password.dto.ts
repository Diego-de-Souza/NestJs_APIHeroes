import { IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordDto {
    @IsString({message: "Senha deve ser string"})
    @IsNotEmpty({message: "Senha não pode estar vazia"})
    cpf: string;

    @IsString({message: "Data de nascimento deve ser string"})
    @IsNotEmpty({message: "Data de nascimento não pode estar vazia"})
    dob: string;

    @IsString({message: "Email deve ser string"})
    @IsNotEmpty({message: "Email não pode estar vazio"})
    email: string;
}
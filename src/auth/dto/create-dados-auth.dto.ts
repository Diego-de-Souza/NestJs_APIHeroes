import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty({message: "Email não pode estar vazio"})
    email: string;

    @IsString()
    @IsNotEmpty({message: "A senha não pode estar vazia"})
    password: string;
}
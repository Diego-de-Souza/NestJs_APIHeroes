import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinDate, MinLength } from "class-validator";
import { IsCEP } from "../../../shared/validators/CepValidator";

export class UpdateUserDTO {
    @IsString({message: "Nome deve ser string"})
    @MinLength(3, {message: "Nome deve conter mais de 3 caracteres"})
    @IsNotEmpty({message: "Nome não pode estar vazio"})
    fullname: string;
        
    @IsString({message: "Apelido deve ser string"})
    @MinLength(3, {message: "Apelido deve conter mais de 3 caracteres"})
    @IsNotEmpty({message: "Apelido não pode estar vazio"})
    nickname: string;
        
    @IsDate()
    @MinDate(new Date("1753-01-01"), {message: "Valor invalido, escolha uma data futura"})
    @IsNotEmpty({message: "Data de nascimento não pode estar vazio"})
    @Transform(({ value }) => new Date(value))
    birthdate: Date;
        
    @IsString({message: "Email deve ser string"})
    @IsEmail()
    @IsNotEmpty({message: "Email não pode estar vazio"})
    firstemail: string;
        
    @IsOptional()
    @IsString({ message: 'O email deve ser uma string.' })
    @IsEmail({}, { message: 'O segundo email deve ser válido.' })
    secondemail?: string; 
        
    @IsString({message: "uf deve ser string"})
    uf: string;
        
    @IsString({message: "address deve ser string"})
    address: string;
        
    @IsString({message: "complemento deve ser string"})
    complement: string;
        
    @IsString({message: "CEP deve ser string"})
    @IsCEP()
    cep : string;
        
    @IsString({message: "Estado deve ser string"})
    state: string;
        
    @IsString({message: "cidade deve ser string"})
    city: string;

    @IsString({message: "Senha não deve ser vazia"})
    @IsOptional()
    password: string
}
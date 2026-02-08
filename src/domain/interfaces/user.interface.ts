
export interface UserInterface {
    fullname: string;
    nickname: string;
    birthdate?: Date;
    firstemail: string;
    secondemail?: string;
    cpf?: string;
    uf?: string;
    address?: string;
    complement?: string;
    cep?: string;
    state?: string;
    city?: string,
    password: string;
    created_at?: Date;
    updated_at?: Date;
}
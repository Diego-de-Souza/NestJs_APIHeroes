import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/models/user.model";
import { UpdateUserDTO } from "./dto/UserUpdate.dto";
import { ApiResponse } from "src/interfaces/ApiResponce.interface";
import { CreateUserDTO } from "./dto/userCreate.dto";


@Injectable()
export class UserService{

    constructor(
        @InjectModel(User)
        private readonly userModel : typeof User
    ){}

    async FindOne(id : number) : Promise<ApiResponse<User>>{

        //To do: adicionar conexão ao sql
        const result = new User;

        if(!result){
            return { 
                message: "Dado não encontrado", 
                status: HttpStatus.NOT_FOUND,
            };
        }

        return { 
            message: "Busca realizada com sucesso", 
            status: 200,
            dataUnit: result,
        };
    }
        
    


    async Register(user : CreateUserDTO) : Promise<ApiResponse<CreateUserDTO>>{
        const result = this.userModel.create(user)
        return {message: "Busca realizada com sucesso", 
            status: HttpStatus.CREATED,
        }
    }

    
    async Update(id : number, user : UpdateUserDTO) : Promise<ApiResponse<UpdateUserDTO>>{

        if(!this.Exist(id)){
            return {message: "Requisição invalida", 
                status: HttpStatus.NOT_FOUND,
            }    
                
        }
        const result = this.userModel.update(user, {where : {id}});

        return {message: "Busca realizada com sucesso", 
            status: HttpStatus.CREATED,
        }    
    }

    async Exist(id: number): Promise<boolean>{

        if(!this.userModel.findOne({where : {id}}))
            return false
        
        return true;
        
    }
}
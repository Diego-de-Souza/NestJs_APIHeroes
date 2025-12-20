import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { MenuPrincipalRepository } from "../../../infrastructure/repositories/menu-principal.repository";

@Injectable()
export class MenuPrincipalUseCase {
    
    constructor(
        private readonly menuPrincipalRepository: MenuPrincipalRepository
    ){}

    async findData(): Promise<ApiResponseInterface<any>>{
        const dadosMenu = await Promise.all([
            this.menuPrincipalRepository.findAllStudio(),
            this.menuPrincipalRepository.findAllTeam(),
            this.menuPrincipalRepository.findAllMorality(),
            this.menuPrincipalRepository.findAllGenre()
        ]);

        if (dadosMenu.some(result => !result)) {
            return{
                status:HttpStatus.NOT_FOUND,
                message: "Alguns dados do banco não retornaram"
            }
        }

        return{
            status: HttpStatus.OK,
            message: "Dados achados com sucesso.",
            dataUnit: dadosMenu
        }
    }
}
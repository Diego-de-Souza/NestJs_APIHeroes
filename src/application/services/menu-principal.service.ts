import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { MenuPrincipalUseCase } from "../../application/use-cases/menu-principal/menu-principal.use-case";

@Injectable()
export class MenuPrincipalService {

    constructor(
        private readonly menuPrincipalUseCase: MenuPrincipalUseCase
    ){}

    async findData(): Promise<ApiResponseInterface<any>>{
        return await this.menuPrincipalUseCase.findData();
    }
}
import { HttpStatus, Injectable, NotFoundException, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IMenuPrincipalRepository } from "../../ports/out/menu-principal.port";
import type { IFindMenuDataPort } from "../../ports/in/menu-principal/find-menu-data.port";

@Injectable()
export class MenuPrincipalUseCase implements IFindMenuDataPort {
    constructor(
        @Inject('IMenuPrincipalRepository') private readonly menuPrincipalRepository: IMenuPrincipalRepository
    ) {}

    async execute(): Promise<ApiResponseInterface<unknown>> {
        const dadosMenu = await Promise.all([
            this.menuPrincipalRepository.findAllStudio(),
            this.menuPrincipalRepository.findAllTeam(),
            this.menuPrincipalRepository.findAllMorality(),
            this.menuPrincipalRepository.findAllGenre()
        ]);

        if (dadosMenu.some(result => !result)) {
            throw new NotFoundException("Alguns dados do banco não retornaram");
        }

        return{
            status: HttpStatus.OK,
            message: "Dados achados com sucesso.",
            dataUnit: dadosMenu
        }
    }
}
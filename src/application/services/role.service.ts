import { Injectable } from "@nestjs/common";
import { RoleRepository } from "../../infrastructure/repositories/role.repository";

@Injectable()
export class RoleService {

    constructor(
        private readonly roleRepository: RoleRepository
    ){}

    async assignDefaultRole(userId: string): Promise<void> {
        await this.roleRepository.create({
            role: "client",
            usuario_id: userId,
            access: "root"
        });
    }
}
import { Injectable } from "@nestjs/common";
import { Role } from "../database/sequelize/models/roles.model";
import { InjectModel } from "@nestjs/sequelize";
import type { IRoleRepository } from "../../application/ports/out/role.port";

@Injectable()
export class RoleRepository implements IRoleRepository {
    constructor(
        @InjectModel(Role) private readonly roleModel: typeof Role
    ) {}

    async create(data: { role: string; usuario_id: string; access: string }): Promise<Role | null> {
        return this.roleModel.create(data as unknown as Record<string, unknown>);
    }
}
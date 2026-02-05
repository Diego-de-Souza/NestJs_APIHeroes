import { Role } from '../../../infrastructure/database/sequelize/models/roles.model';

/** Port OUT: contrato para atribuir papel padrão (create role). UseCase → Port → Repository. */
export interface IRoleRepository {
  create(data: { role: string; usuario_id: string; access: string }): Promise<Role | null>;
}

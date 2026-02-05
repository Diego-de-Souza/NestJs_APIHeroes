import { AccessLog } from '../../../infrastructure/database/sequelize/models/access-log.model';
import { AccessByMonth } from '../../../domain/interfaces/dashboard.interface';

/** Port OUT: contrato do repositório de dashboard. UseCase → Port → Repository. */
export interface IDashboardRepository {
  getNumberUsersRegistered(): Promise<number>;
  getNumberArticlesRegistered(): Promise<number>;
  getNumberAcessesRegistered(): Promise<AccessLog[]>;
  getNumberEventsRegistered(): Promise<number>;
  getNumberAcessesByMonth(): Promise<AccessByMonth>;
  getUsersRegisteredByMonth(): Promise<AccessByMonth>;
}

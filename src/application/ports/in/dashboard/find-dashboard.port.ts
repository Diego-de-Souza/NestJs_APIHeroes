import { ApiResponseInterface } from '../../../../domain/interfaces/APIResponse.interface';
import { DashboardInterface } from '../../../../domain/interfaces/dashboard.interface';

/** Port IN: contrato para buscar dashboard. Controller → Port → UseCase. */
export interface IFindDashboardPort {
  execute(): Promise<ApiResponseInterface<DashboardInterface>>;
}

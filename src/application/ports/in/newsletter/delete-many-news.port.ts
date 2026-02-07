import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";

/** Port IN: contrato para excluir várias newsletters. */
export interface IDeleteManyNewsPort {
    execute(ids: string[], usuario_id: string): Promise<ApiResponseInterface<number>>;
}

import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";

/** Port IN: contrato para excluir uma newsletter. */
export interface IDeleteNewsPort {
    execute(id: string, usuario_id: string): Promise<ApiResponseInterface<number>>;
}

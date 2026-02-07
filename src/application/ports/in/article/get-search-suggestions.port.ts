import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { SearchSuggestionsDto } from "../../../../interface/dtos/articles/search-suggestions.dto";


export interface IGetSearchSuggestionsPort {
    execute(dto: SearchSuggestionsDto): Promise<ApiResponseInterface<string>>;
}
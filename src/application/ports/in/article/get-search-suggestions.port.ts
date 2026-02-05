import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { SearchSuggestionsDto } from "src/interface/dtos/articles/search-suggestions.dto";


export interface IGetSearchSuggestionsPort {
    execute(dto: SearchSuggestionsDto): Promise<ApiResponseInterface<string>>;
}
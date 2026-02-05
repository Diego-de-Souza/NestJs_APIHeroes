import { CreateStudioDto } from '../../../interface/dtos/studio/create-studio.dto';
import { Studio } from '../../../infrastructure/database/sequelize/models/studio.model';

/** Port OUT: contrato do repositório de estúdio. UseCase → Port → Repository. */
export interface IStudioRepository {
  findStudioByName(name: string): Promise<Studio | null>;
  create(studioDto: CreateStudioDto): Promise<Studio | null>;
  findAllStudio(): Promise<Studio[] | null>;
  DeleteStudio(id: string): Promise<number>;
  findStudioById(id: string): Promise<Studio | null>;
  updateStudio(id: string, studioDto: CreateStudioDto): Promise<void>;
}

import { ImageDto } from "../../interface/dtos/games/image.dto";

export interface ImageProvider {
  fetchImages(theme: string, count: number): Promise<ImageDto[]>;
}
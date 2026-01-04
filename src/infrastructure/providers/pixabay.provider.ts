import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ImageProvider } from '../../domain/interfaces/imageProvider.interface';
import { ImageDto } from '../../interface/dtos/games/image.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PixabayProvider implements ImageProvider {
  private readonly logger = new Logger(PixabayProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchImages(theme: string, count: number): Promise<ImageDto[]> {
    const apiKey = process.env.PIXABAY_API_KEY;
    this.logger.debug('PIXABAY_API_KEY', apiKey);
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(theme)}&per_page=${count}`;
    try {
      const res = await firstValueFrom(this.httpService.get(url));
      this.logger.debug('Pixabay response', res.data);
      return res.data.hits.map(img => ({
        url: img.largeImageURL,
        thumbnail: img.previewURL,
        provider: 'pixabay'
      }));
    } catch (err) {
      this.logger.error('Pixabay error', err.response?.data || err.message);
      throw err;
    }
  }
}
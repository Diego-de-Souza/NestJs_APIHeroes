import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ImageProvider } from '../../domain/interfaces/imageProvider.interface';
import { ImageDto } from '../../interface/dtos/games/image.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PexelsProvider implements ImageProvider {
  private readonly logger = new Logger(PexelsProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchImages(theme: string, count: number): Promise<ImageDto[]> {
    const apiKey = process.env.PEXELS_API_KEY;
    this.logger.debug('PEXELS_API_KEY', apiKey);
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(theme)}&per_page=${count}`;
    const headers = { Authorization: apiKey };
    try {
      const res = await firstValueFrom(this.httpService.get(url, { headers }));
      this.logger.debug('Pexels response', res.data);
      return res.data.photos.map(img => ({
        url: img.src.large,
        thumbnail: img.src.tiny,
        provider: 'pexels'
      }));
    } catch (err) {
      this.logger.error('Pexels error', err.response?.data || err.message);
      throw err;
    }
  }
}
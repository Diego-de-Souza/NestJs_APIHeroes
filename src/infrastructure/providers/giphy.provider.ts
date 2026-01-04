import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ImageProvider } from '../../domain/interfaces/imageProvider.interface';
import { ImageDto } from '../../interface/dtos/games/image.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GiphyProvider implements ImageProvider {
  private readonly logger = new Logger(GiphyProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchImages(theme: string, count: number): Promise<ImageDto[]> {
    const apiKey = process.env.GIPHY_API_KEY;
    this.logger.debug('GIPHY_API_KEY', apiKey);
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(theme)}&limit=${count}`;
    try {
      const res = await firstValueFrom(this.httpService.get(url));
      this.logger.debug('Giphy response', res.data);
      return res.data.data.map(img => ({
        url: img.images.original.url,
        thumbnail: img.images.fixed_height_small.url,
        provider: 'giphy'
      }));
    } catch (err) {
      this.logger.error('Giphy error', err.response?.data || err.message);
      throw err;
    }
  }
}
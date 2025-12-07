import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ImageProvider } from '../../domain/interfaces/imageProvider.interface';
import { ImageDto } from '../../interface/dtos/games/image.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PexelsProvider implements ImageProvider {
  constructor(private readonly httpService: HttpService) {}

  async fetchImages(theme: string, count: number): Promise<ImageDto[]> {
    const apiKey = process.env.PEXELS_API_KEY;
    console.log('PEXELS_API_KEY', apiKey);
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(theme)}&per_page=${count}`;
    const headers = { Authorization: apiKey };
    try {
      const res = await firstValueFrom(this.httpService.get(url, { headers }));
      console.log('Pexels response', res.data);
      return res.data.photos.map(img => ({
        url: img.src.large,
        thumbnail: img.src.tiny,
        provider: 'pexels'
      }));
    } catch (err) {
      console.error('Pexels error', err.response?.data || err.message);
      throw err;
    }
  }
}
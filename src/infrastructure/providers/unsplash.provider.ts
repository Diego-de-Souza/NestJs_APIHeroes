import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ImageProvider } from '../../domain/interfaces/imageProvider.interface';
import { ImageDto } from '../../interface/dtos/games/image.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UnsplashProvider implements ImageProvider {
  constructor(private readonly httpService: HttpService) {}

  async fetchImages(theme: string, count: number): Promise<ImageDto[]> {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    console.log('UNSPLASH_ACCESS_KEY', accessKey);
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(theme)}&per_page=${count}`;
    const headers = { Authorization: `Client-ID ${accessKey}` };
    try {
      const res = await firstValueFrom(this.httpService.get(url, { headers }));
      console.log('Unsplash response', res.data);
      return res.data.results.map(img => ({
        url: img.urls.regular,
        thumbnail: img.urls.thumb,
        provider: 'unsplash'
      }));
    } catch (err) {
      console.error('Unsplash error', err.response?.data || err.message);
      throw err;
    }
  }
}
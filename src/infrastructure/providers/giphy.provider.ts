import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ImageProvider } from '../../domain/interfaces/imageProvider.interface';
import { ImageDto } from '../../interface/dtos/games/image.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GiphyProvider implements ImageProvider {
  constructor(private readonly httpService: HttpService) {}

  async fetchImages(theme: string, count: number): Promise<ImageDto[]> {
    const apiKey = process.env.GIPHY_API_KEY;
    console.log('GIPHY_API_KEY', apiKey);
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(theme)}&limit=${count}`;
    try {
      const res = await firstValueFrom(this.httpService.get(url));
      console.log('Giphy response', res.data);
      return res.data.data.map(img => ({
        url: img.images.original.url,
        thumbnail: img.images.fixed_height_small.url,
        provider: 'giphy'
      }));
    } catch (err) {
      console.error('Giphy error', err.response?.data || err.message);
      throw err;
    }
  }
}
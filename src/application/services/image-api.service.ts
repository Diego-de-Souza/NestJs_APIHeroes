import { Injectable, Logger, Inject } from '@nestjs/common';
import { ImageProvider } from '../../domain/interfaces/imageProvider.interface';
import { ImageDto } from '../../interface/dtos/games/image.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageApiService {
  private readonly logger = new Logger(ImageApiService.name);

  constructor(
    @Inject('IMAGE_PROVIDERS') private readonly providers: ImageProvider[],
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async fetchImages(theme: string, count: number): Promise<ImageDto[]> {
    const cacheKey = `images:${theme}:${count}`;
    
    // 1. Tenta cache em memória
    const cached = await this.cacheManager.get<ImageDto[]>(cacheKey);
    if (cached) {
      this.logger.log('Retornando do cache em memória');
      return cached;
    }

    // 2. Tenta fallback em arquivo local (opcional)
    const cacheDir = path.join(process.cwd(), 'cache');
    const fallbackPath = path.join(cacheDir, `${cacheKey}.json`);
    if (fs.existsSync(fallbackPath)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
        if (fileData && fileData.length >= count) {
          this.logger.log('Retornando do cache em arquivo');
          return fileData;
        }
      } catch (err) {
        this.logger.warn(`Erro ao ler fallback local: ${err.message}`);
      }
    }

    // 3. Busca nas APIs externas
    for (const provider of this.providers) {
      try {
        this.logger.log(`Tentando provider: ${provider.constructor.name}`);
        const images = await provider.fetchImages(theme, count);
        this.logger.log(`Provider ${provider.constructor.name} retornou ${images?.length || 0} imagens`);
        
        if (!images || images.length === 0) {
          this.logger.warn(`Provider ${provider.constructor.name} não retornou imagens`);
          continue;
        }

        // Garante que as imagens são únicas (por URL)
        const uniqueImages = images.filter(
          (img, idx, arr) => arr.findIndex(i => i.url === img.url) === idx
        ).slice(0, count);
        
        this.logger.log(`Imagens únicas após filtro: ${uniqueImages.length}`);

        if (uniqueImages.length >= count) {
          this.logger.log('Salvando no cache e retornando imagens reais');
          await this.cacheManager.set(cacheKey, uniqueImages, 60 * 60); // 1h cache
          
          // Cria pasta cache ANTES de salvar o arquivo
          try {
            fs.mkdirSync(cacheDir, { recursive: true });
            fs.writeFileSync(fallbackPath, JSON.stringify(uniqueImages));
          } catch (fileErr) {
            this.logger.warn(`Erro ao salvar cache em arquivo: ${fileErr.message}`);
          }
          
          return uniqueImages;
        } else {
          this.logger.warn(`Provider ${provider.constructor.name} retornou apenas ${uniqueImages.length} imagens, necessário ${count}`);
        }
      } catch (err) {
        this.logger.error(`Provider ${provider.constructor.name} failed: ${err.message}`);
      }
    }

    // 4. Fallback: SVGs únicos e URL-encoded
    this.logger.warn('Nenhum provider retornou imagens suficientes, usando fallback SVG');
    const fallback = Array(count).fill(null).map((_, i) => {
      const letter = String.fromCharCode(65 + (i % 26)); // A, B, C, ...
      const colors = ['#888', '#0af', '#fa0', '#0fa', '#a0f', '#af0', '#f0a', '#08f', '#f80', '#80f'];
      const color = colors[i % colors.length];
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='${color}'/><text x='50%' y='50%' font-size='60' text-anchor='middle' fill='white' dy='.3em'>${letter}</text></svg>`;
      return {
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg),
        provider: 'svg-fallback'
      };
    });
    return fallback;
  }

  async listThemes(): Promise<string[]> {
    return ['animals', 'nature', 'cities', 'food', 'sports', 'technology'];
  }

  async getApiStatus(): Promise<any> {
    return this.providers.map(p => ({ provider: p.constructor.name, status: 'ok' }));
  }
}
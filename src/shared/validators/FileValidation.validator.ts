import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import exp from "constants";
import type { Express } from 'express';

@Injectable()
export class FileValidationPipe implements PipeTransform{
    async transform(value: Express.Multer.File[]){ {
            if(!value ||value.length > 2 || value.length < 2){
                throw new BadRequestException("Deve ser enviado duas imagens");
            }
            value.forEach(element => {
                if (element.mimetype !== 'image/jpeg' && element.mimetype !== 'image/png') {
                throw new BadRequestException('Apenas imagens JPEG e PNG são aceitas.');
                }
                if (element.size > 1024 *1000 * 65) { // 65KB
                throw new BadRequestException('O tamanho máximo permitido é de 65KB.');
                }
                if (element.size < 1024) { // 1KB
                throw new BadRequestException('O tamanho mínimo permitido é de 1KB.');
                }
            });
            return value;
        }

    }
}
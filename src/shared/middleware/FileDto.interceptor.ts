import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";


//Interceptor para validar o tamanho e tipo de arquivo de imagens
@Injectable()
export class FileDtoInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        //Pega a requisição
        const request = context.switchToHttp().getRequest();
        //Pega os arquivos e o body da requisição
        const {files, body} = request;
        
        //Verifica se foram enviadas duas imagens
        if(!files ||files.length > 2 || files.length < 2){
        
            throw new BadRequestException("Deve ser enviado duas imagens");
        
        }
        
        //Verifica se as imagens são JPEG ou PNG e se estão dentro do tamanho permitido
        files.forEach(element => {
        
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
            
        body.image1 = files[0];
        body.image2 = files[1];

        return next.handle();
    }
}
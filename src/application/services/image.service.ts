import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConverterImageUseCase } from "../use-cases/images/converter-image.use-case";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ImageService {
    private readonly logger = new Logger(ImageService.name);
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly cloudfrontUrl: string;
    private readonly region: string;

    constructor(
        private readonly converterImageUseCase: ConverterImageUseCase,
        private readonly configService: ConfigService
    ){
        this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || process.env.AWS_S3_BUCKET || '';
        this.cloudfrontUrl = this.configService.get<string>('CLOUDFRONT_URL') || process.env.CLOUDFRONT_URL || '';

        // Na EC2, o S3Client usa automaticamente a IAM Role (não precisa de credentials explícitas)
        // Localmente ou fora da EC2, pode usar credenciais via variáveis de ambiente se necessário
        this.s3Client = new S3Client({
            region: this.region,
            // Credenciais são obtidas automaticamente da IAM Role quando roda na EC2
            // Se necessário para desenvolvimento local, pode usar:
            // credentials: process.env.AWS_ACCESS_KEY_ID ? {
            //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            // } : undefined
        });
    }
    
    async saveImageBase64(imageBase64: string, imageName: string, folderName: string): Promise<string> {
        let imageUrl = "";
        try{
            // Converte base64 para buffer
            const imageBuffer = await this.converterImageUseCase.convertBase64ToImageFile(imageBase64, imageName);
            // Gera nome único para imagem
            const fileName = `${folderName}/${uuidv4()}.jpg`;
            
            // Faz upload no S3 (bucket privado)
            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: imageBuffer,
                ContentType: "image/jpeg",
                // Não usar ACL: 'public-read' - bucket é privado, acesso via CloudFront
            }));

            // Monta URL pública via CloudFront (não do S3 diretamente)
            imageUrl = `${this.cloudfrontUrl}/${fileName}`;
            return imageUrl;
        }catch(error){
            this.logger.error("Error saving image:", error);
        }

    }

    async saveImageBuffer(imageBuffer: Buffer | Uint8Array, folderName: string, contentType: string = "image/jpeg"): Promise<string> {
        let imageUrl = "";
        try{
            // Converte Uint8Array para Buffer se necessário
            const buffer = Buffer.isBuffer(imageBuffer) ? imageBuffer : Buffer.from(imageBuffer);
            
            // Detecta o tipo de conteúdo baseado nos primeiros bytes (magic numbers)
            let detectedContentType = contentType;
            if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
                detectedContentType = "image/png";
            } else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
                detectedContentType = "image/jpeg";
            } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
                detectedContentType = "image/gif";
            } else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
                detectedContentType = "image/webp";
            }

            // Determina a extensão baseada no tipo de conteúdo
            const extension = detectedContentType === "image/png" ? "png" : 
                            detectedContentType === "image/gif" ? "gif" :
                            detectedContentType === "image/webp" ? "webp" : "jpg";

            // Gera nome único para imagem
            const fileName = `${folderName}/${uuidv4()}.${extension}`;
            
            // Faz upload no S3 (bucket privado)
            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: buffer,
                ContentType: detectedContentType,
                // Não usar ACL: 'public-read' - bucket é privado, acesso via CloudFront
            }));

            // Monta URL pública via CloudFront (não do S3 diretamente)
            imageUrl = `${this.cloudfrontUrl}/${fileName}`;
            return imageUrl;
        }catch(error){
            this.logger.error("Error saving image from buffer:", error);
            throw error;
        }
    }

    async deleteImage(imageUrl: string): Promise<void> {
        try{
            // Remove a URL do CloudFront para obter apenas o key do S3
            // Exemplo: https://dlh5iebwq8aw1.cloudfront.net/heroes/image.jpg -> heroes/image.jpg
            let key = imageUrl;
            if (this.cloudfrontUrl) {
                key = imageUrl.replace(this.cloudfrontUrl, '').replace(/^\/+/, '');
            } else {
                // Fallback: tenta extrair do padrão S3 URL ou CloudFront
                key = imageUrl.replace(/^https?:\/\/[^\/]+\//, '').replace(/^\/+/, '');
            }

            await this.s3Client.send(new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key
            }));

            this.logger.log(`Imagem deletada: ${key}`);
        }catch(error){
            this.logger.error("Error deleting image:", error);
            throw error;
        }
    }
}
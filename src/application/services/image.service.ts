import { Injectable } from "@nestjs/common";
import { ConverterImageUseCase } from "../use-cases/images/converter-image.use-case";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import * as process from "process";

@Injectable()
export class ImageService {
    private readonly connection_s3: S3Client;
    constructor(
        private readonly converterImageUseCase: ConverterImageUseCase
    ){
        this.connection_s3 = new S3Client({
            region: "auto",
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY!,
                secretAccessKey: process.env.R2_SECRET_KEY!
            }
        });
    }
    
    async saveImageBase64(imageBase64: string, imageName: string, folderName: string): Promise<string> {
        let imageUrl = "";
        try{
            // Converte base64 para buffer
            const imageBuffer = await this.converterImageUseCase.convertBase64ToImageFile(imageBase64, imageName);
            // Gera nome único para imagem
            const fileName = `${folderName}/${uuidv4()}.jpg`;
            
            // Faz upload
            await this.connection_s3.send(new PutObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: fileName,
                Body: imageBuffer,
                ContentType: "image/jpeg",
                ACL: "public-read"
            }));

            // Monta URL pública
            imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
            return imageUrl;
        }catch(error){
            console.error("Error saving image:", error);
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
            
            // Faz upload
            await this.connection_s3.send(new PutObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: fileName,
                Body: buffer,
                ContentType: detectedContentType,
                ACL: "public-read"
            }));

            // Monta URL pública
            imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
            return imageUrl;
        }catch(error){
            console.error("Error saving image from buffer:", error);
            throw error;
        }
    }

    async deleteImage(imageUrl: string): Promise<void> {
        try{
            const publicUrl = process.env.R2_PUBLIC_URL!;
            let key = imageUrl.replace(publicUrl, '').replace(/^\/+/, '');

            await this.connection_s3.send(new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: key
            }));
        }catch(error){
            console.error("Error deleting image:", error);
        }
    }
}
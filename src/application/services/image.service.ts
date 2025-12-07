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
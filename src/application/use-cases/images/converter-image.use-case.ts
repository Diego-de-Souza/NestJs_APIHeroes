import { Injectable } from "@nestjs/common";
import { Buffer } from "buffer";

@Injectable()
export class ConverterImageUseCase {
    
    async convertBase64ToImageFile(imageBase64: string, imageName: string): Promise<Buffer> {
        // Converte base64 para buffer
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        return buffer;
    }
}
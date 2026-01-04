import { BadRequestException, FileTypeValidatorOptions, FileValidator } from "@nestjs/common";
import { IFile } from "@nestjs/common/pipes/file/interfaces";
import { MinFileSizeValidatorOptions } from "../../domain/interfaces/file-validator.interface";

export class MinFileSizeValidator extends FileValidator<MinFileSizeValidatorOptions,IFile> {

    constructor(validationOptions: { minSize: number }) {
        super(validationOptions);
    }

    
    isValid(file?: IFile | IFile[]): boolean | Promise<boolean> {
        if (!file) return false;
        if(!Array.isArray(file)){

            return this.validationOptions.minSize <= file.size
        }
        else{
            return file.every((element => 
                element.size >= this.validationOptions.minSize
            ))
        }

    }
    
    buildErrorMessage(file: IFile | IFile[]): string {
        return `O tamanho do arquivo deve ser no mínimo ${this.validationOptions.minSize} bytes.`;
    }
}
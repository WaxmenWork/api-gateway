import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exceptions";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }
        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);
        
        if (errors.length) {
            let messages = errors.map(err => {
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
            });
            throw new ValidationException(messages);
        }
        return value;
    }

    private toValidate(metatype): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
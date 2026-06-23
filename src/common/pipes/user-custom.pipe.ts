
import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value.password !== value.cPassword){
            throw new HttpException("password and cPasswords must be matched",HttpStatus.FORBIDDEN);
        }
        return value;
    }
}





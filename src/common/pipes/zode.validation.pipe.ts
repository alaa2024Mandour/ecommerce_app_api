import { PipeTransform, ArgumentMetadata, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
            const {success,error} = this.schema.safeParse(value);
            if(!success){
                throw new HttpException(
                    {
                        message:error.message,
                        error:error.issues.map((issue)=>{
                            return {
                                path:issue.path,
                                message:issue.message
                            }
                        })
                    },
                    HttpStatus.BAD_REQUEST
                )
            }
            return value
    }
}
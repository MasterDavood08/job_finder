import { ArgumentMetadata, PipeTransform, HttpException, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ResponseError } from '../dto/response.dto';

export class CustomValidation implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        // Pass `skipMissingProperties` as part of the custom validation
        const errors = await validate(object, { skipMissingProperties: true, validationError: { target: false } });
        let result = errors.map(e => {
            console.log(e);
            // let m = { [e.property]: Object.values(e.constraints) }
            let m = Object.values(e.constraints)
            return m
        })
        result = [...new Set([].concat(...result))]// remove duplicated
        if (errors.length > 0) {
            throw new HttpException(new ResponseError('bad request', result), HttpStatus.BAD_REQUEST)
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}

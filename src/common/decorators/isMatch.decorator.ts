import { 
    registerDecorator, 
    ValidationArguments, 
    ValidationOptions, 
    ValidatorConstraint, 
    ValidatorConstraintInterface 
} from "class-validator";

@ValidatorConstraint({ name: 'customText', async: false })
export class matchProp implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text === args.object[args.constraints[0]]

    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return `${args.property} must match ${args.constraints[0]}`;
    }
}


export function IsMatch(constraints:string[],validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: matchProp,
        });
    };
}
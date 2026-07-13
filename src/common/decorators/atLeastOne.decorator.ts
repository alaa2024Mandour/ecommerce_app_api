import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments
} from "class-validator";


export function AtLeastOne(requireFields: string[], validationOptions?: ValidationOptions) {
    return function (constructor:Function ) { 
        registerDecorator({
            target: constructor,
            propertyName: "",
            options: validationOptions,
            constraints:requireFields,
            validator:{
                validate(value: string, args: ValidationArguments) {
                    console.log({value,args});
                    return requireFields.some(field=>args.object[field])
                },

                defaultMessage(args: ValidationArguments) {
                    // here you can provide default error message if validation failed
                    console.log({args});
                    return `at least one Of this fields are required ${requireFields.join(" , ")}`;
                }
            },
        });
    };
}
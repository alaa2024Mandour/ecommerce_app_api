import { Body, Controller, Delete, Get, ParseIntPipe, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CustomValidationPipe } from "src/common/pipes/user-custom.pipe";
import { CreateUserDTO } from "./dto/create-user.dto";
import { ZodValidationPipe } from "src/common/pipes/zode.validation.pipe";
import { createUserSchema, type zodCreateUserDTO } from "./validation/create-user.validation";

@Controller("users")
// @UsePipes(
//         new ValidationPipe({
//             whitelist:true, // Ignore any properties that do not have any validation decorators
//             forbidNonWhitelisted:true, // Throws an error (Bad Request) if non-whitelisted properties are present
//             stopAtFirstError:true, // To return only the first error message if the property have more than one decorator 
//             errorHttpStatusCode:401, // Control status code
//         })) // to validate all APIs in this controller
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get()
    getAllUsers(): Object[] {
        return this.userService.getAllUsers()
    }

    @Post()
    createUser(@Body()
    body: CreateUserDTO): object {
        // return this.userService.createUser(age)
        return body
    }

    // @Post()
    // createUser(@Body(new ZodValidationPipe(createUserSchema)) body:zodCreateUserDTO):zodCreateUserDTO{
    //     // return this.userService.createUser(age)
    //     return body
    // }

    @Delete()
    deleteUser(@Body() body: { name: string }): object {
        return this.userService.deleteUser(body.name)
    }
}
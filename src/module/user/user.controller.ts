import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { signUpDTO } from "./dto/signUp.dto";
import { signInDTO } from "./dto/signIn.dto";
import { FileInterceptor } from "@nestjs/platform-express";

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

    @Get("/getUsers")
    getAllUsers() {
        return this.userService.getAllUsers()
    }

    @Post("/signup")
    signUp(@Body()
    body: signUpDTO): object {
        return this.userService.signUp(body)
    }

    @Post("/signin")
    signIn(@Body()
    body: signInDTO
    ): object {
        return this.userService.signIn(body)
    }


    // @Post('upload')
    // @UseInterceptors(FileInterceptor('file'))
    // // uploadFile(@UploadedFile() file: Express) {
    //     console.log(file);
    // }


    // @Post()
    // createUser(@Body(new ZodValidationPipe(createUserSchema)) body:zodCreateUserDTO):zodCreateUserDTO{
    //     // return this.userService.createUser(age)
    //     return body
    // }

    // @Delete()
    // deleteUser(@Body() body: { name: string }): object {
    //     return this.userService.deleteUser(body.name)
    // }
}
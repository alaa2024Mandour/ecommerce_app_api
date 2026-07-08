import { StorageEnum } from './../../common/enum/multer.enum';
import {
    Controller,
    Get,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthorizationGuard } from "src/common/guards/authorization.guard";
import { RoleEnum } from "src/common/enum/user.enum";
import { GetUser } from "src/common/decorators/user.decorator";
import type { UserDocument } from "../DB/models/user.model";
import { Auth } from "src/common/decorators/auth.decorator";
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor
} from '@nestjs/platform-express';
import { MimeTypesEnum } from "src/common/enum/multer.enum";
import { multerCloud } from "src/common/utils/multer/multer.utils";

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
    @Auth({ access_role: [RoleEnum.user] })
    getAllUsers() {
        return this.userService.getAllUsers()
    }

    @Get("/getProfile")
    @Auth({ access_role: [RoleEnum.user, RoleEnum.admin] })
    @UseGuards(AuthorizationGuard)
    getProfile(@GetUser() user: UserDocument) {
        return user
    }

    // ------------- upload single file from one field ----------------
    @Post('upload/profilePic')
    @Auth({ access_role: [RoleEnum.user, RoleEnum.admin] })
    // @UseGuards(AuthorizationGuard)
    @UseInterceptors(
        FileInterceptor(
            'profilePic',
            multerCloud({ fileType: MimeTypesEnum.images })
        ))
    uploadProfilePic(
        @GetUser() user: UserDocument,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.userService.uploadProfilePic({
            userId: user._id as unknown as string,
            picture: file
        })
    }

    // ------------- upload multi files from single field ----------------
    @Post('upload/files')
    @Auth({ access_role: [RoleEnum.user, RoleEnum.admin] })
    @UseInterceptors(
        FilesInterceptor(
            'attachments',
            3,
            multerCloud({ storageType: StorageEnum.disk, fileType: MimeTypesEnum.images })
        ))
    uploadFiles(
        @GetUser() user: UserDocument,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        return this.userService.uploadFiles({
            userId: user._id as unknown as string,
            files
        })
    }


    // ------------- upload multi fields files ----------------
    @Post('upload/productPics')
    @Auth({ access_role: [RoleEnum.user, RoleEnum.admin] })
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: "productImage", maxCount: 1 },
                { name: "productSubImages", maxCount: 5 },
            ],
            multerCloud({ storageType: StorageEnum.disk, fileType: MimeTypesEnum.images })
        ))
    uploadProductImages(
        @GetUser() user: UserDocument,
        @UploadedFiles() files: { productImage: Express.Multer.File[], productSubImages?: Express.Multer.File[] }) {
        return this.userService.uploadProductImages({
            userId:user._id as unknown as string,
            files
        })
    }

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
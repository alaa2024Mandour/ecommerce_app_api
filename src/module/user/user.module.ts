import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserModel } from "../DB/models/user.model";
import UserRepository from "../DB/repositories/user.repository";
import { EncryptionService } from "src/common/utils/security/encrypt.security";
import { HashingService } from "src/common/utils/security/hash.security";

@Module({
    imports:[
        UserModel
    ],
    controllers:[
        UserController
    ],
    providers:[
        UserService,
        UserRepository,
        EncryptionService,
        HashingService
    ],
    exports:[],
})
export class UserModule{

}
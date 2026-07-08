import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserModel } from "../DB/models/user.model";
import UserRepository from "../DB/repositories/user.repository";
import { AuthorizationService } from "src/common/services/authorization.service";
import { S3Service } from "src/common/services/s3.service";
@Module({
    imports: [
        UserModel,
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService,
        UserRepository,
        AuthorizationService,
        S3Service
    ],
    exports: [],
})
export class UserModule {}

// export class UserModule implements NestModule {
//     configure(consumer: MiddlewareConsumer) {
//         consumer
//         .apply(TokenTypeMid(TokenEnum.access_token),AuthenticationMiddleware)
//         .forRoutes(UserController)
//     }
// }
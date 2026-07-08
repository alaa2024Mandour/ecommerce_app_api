import { AuthService } from "./auth.service";
import { UserModel } from "../../DB/models/user.model";
import UserRepository from "../../DB/repositories/user.repository";
import { EncryptionService } from "src/common/utils/security/encrypt.security";
import { HashingService } from "src/common/utils/security/hash.security";
import { EmailService } from "src/common/utils/email/email.service";
import { AuthController } from "./auth.controller";
import { Module } from "@nestjs/common";
import { RedisService } from "../../DB/redis/redis.service";
import { AuthorizationModule } from "src/common/authModule/authorization.module";

@Module({
    imports: [
        UserModel,
        AuthorizationModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        UserRepository,
        EncryptionService,
        HashingService,
        EmailService,
        RedisService
    ],
    exports: [],
})
export class AuthModule {}

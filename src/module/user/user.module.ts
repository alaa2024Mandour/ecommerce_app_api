import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserModel } from "../DB/models/user.model";
import UserRepository from "../DB/repositories/user.repository";
import { EncryptionService } from "src/common/utils/security/encrypt.security";
import { HashingService } from "src/common/utils/security/hash.security";
import { EmailService } from "src/common/utils/email/email.service";
import { createClient } from "redis";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        UserModel,
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule], 
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.user.accessSecret'),
                signOptions: {
                    expiresIn: configService.get<number>('jwt.expires_in') || '1h',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService,
        UserRepository,
        EncryptionService,
        HashingService,
        EmailService,
    ],
    exports: [],
})
export class UserModule {

}
import { AuthService } from "./auth.service";
import { UserModel } from "../DB/models/user.model";
import UserRepository from "../DB/repositories/user.repository";
import { EncryptionService } from "src/common/utils/security/encrypt.security";
import { HashingService } from "src/common/utils/security/hash.security";
import { EmailService } from "src/common/utils/email/email.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthorizationService } from "src/common/services/authorization.service";
import { StringValue } from 'ms';
import { AuthController } from "./auth.controller";
import { Module } from "@nestjs/common";
import { RedisService } from "../DB/redis/redis.service";

@Module({
    imports: [
        UserModel,
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule], 
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.user.accessSecret'),
                signOptions: {
                    expiresIn: (configService.get<string>('jwt.expires_in') || "1h") as StringValue
                },
            }),
            inject: [ConfigService],
        })
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
        AuthorizationService,
        RedisService
    ],
    exports: [],
})
export class AuthModule {}

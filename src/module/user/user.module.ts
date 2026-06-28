import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserModel } from "../DB/models/user.model";
import UserRepository from "../DB/repositories/user.repository";
import { EncryptionService } from "src/common/utils/security/encrypt.security";
import { HashingService } from "src/common/utils/security/hash.security";
import { EmailService } from "src/common/utils/email/email.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticationMiddleware, TokenTypeMid } from "src/common/middleware/authentication.middleware";
import { AuthorizationService } from "src/common/services/authorization.service";
import { StringValue } from 'ms';
import { TokenEnum } from "src/common/enum/token.enum";
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
        AuthorizationService,
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
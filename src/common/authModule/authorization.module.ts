import { StringValue } from 'ms';
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthorizationService } from './authorization.service';
import UserRepository from 'src/DB/repositories/user.repository';
import { UserModel } from 'src/DB/models/user.model';

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
    providers:[
        AuthorizationService,
        UserRepository
    ],
    exports:[
        AuthorizationService
    ]
})
export class AuthorizationModule { }
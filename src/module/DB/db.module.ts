import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {

                const nodeEnv = process.env.NODE_ENV;
                const dbUri = nodeEnv === 'production'
                    ? configService.get<string>('database.onlineUri')
                    : configService.get<string>('database.localUri');

                console.log(dbUri)
                return {
                    uri: dbUri,
                };
            },
            inject: [ConfigService],
        }),
    ]
})
export class DBModule { }
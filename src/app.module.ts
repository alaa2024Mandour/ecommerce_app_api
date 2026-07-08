import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import configurations from "./config/configurations"
import { DBModule } from './module/DB/db.module';
import { SecurityModule } from './common/utils/security/security.module';
import { RedisModule } from './module/DB/redis/redis.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.development"],
      load: [configurations],
      isGlobal: true
    }),
    DBModule,
    UserModule,
    SecurityModule,
    RedisModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }

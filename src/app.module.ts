import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import configurations, * as AppConfigurations from "./config/configurations"
import { DBModule } from './module/DB/db.module';
import { SecurityModule } from './common/utils/security/security.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.development"],
      load: [configurations],
      isGlobal: true
    }),
    DBModule,
    UserModule,
    SecurityModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }

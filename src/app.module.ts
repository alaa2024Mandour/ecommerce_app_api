import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurations, * as AppConfigurations from "./config/configurations"
import { DBModule } from './module/DB/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.development"],
      load: [configurations],
      isGlobal: true
    }),
    DBModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

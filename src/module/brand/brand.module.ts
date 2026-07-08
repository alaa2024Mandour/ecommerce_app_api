import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { AuthorizationService } from 'src/common/authModule/authorization.service';
import { JwtService } from '@nestjs/jwt';
import { BrandModel } from 'src/DB/models/brand.model';
import UserRepository from 'src/DB/repositories/user.repository';
import { UserModel } from 'src/DB/models/user.model';
import { ConfigService } from '@nestjs/config';
import { AuthorizationModule } from 'src/common/authModule/authorization.module';
import { S3Service } from 'src/common/services/s3.service';

@Module({
  imports:[
    BrandModel,
    UserModel,
    AuthorizationModule
  ],
  controllers:[BrandController],
  providers: [
    BrandService,
    BrandRepository,
    UserRepository,
    JwtService,
    ConfigService,
    S3Service
  ]
})
export class BrandModule {}

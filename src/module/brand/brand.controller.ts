import { RoleEnum } from 'src/common/enum/user.enum';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BrandService } from './brand.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utils/multer/multer.utils';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CreateBrandDTO } from './dto/createBrand.dto';
import type { UserDocument } from 'src/DB/models/user.model';
import { GetUser } from 'src/common/decorators/user.decorator';

@Controller('brand')
export class BrandController {

    constructor(
        private readonly brandService:BrandService,
    ){}


    @Post("createBrand")
    @Auth({access_role:[RoleEnum.admin]})
    @UseInterceptors(FileInterceptor("logo",multerCloud({})))
    async createBrand(
        @Body() data:CreateBrandDTO,
        @GetUser() user:UserDocument,
        @UploadedFile() logo : Express.Multer.File
    ){
        return await this.brandService.createBrand(data,logo,user)
    }
}

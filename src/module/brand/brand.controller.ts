import { RoleEnum } from 'src/common/enum/user.enum';
import { 
    Body, 
    Controller, 
    Param, 
    Patch, 
    Post,
    Get, 
    UploadedFile, 
    UseInterceptors,
    Query,
    Delete
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utils/multer/multer.utils';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CreateBrandDTO } from './dto/createBrand.dto';
import type { UserDocument } from 'src/DB/models/user.model';
import { GetUser } from 'src/common/decorators/user.decorator';
import { UpdateBrandDTO } from './dto/updateBrand.dto';
import { IdDto } from 'src/common/DTO/id.dto';
import { GetPaginationDataDTO } from 'src/common/DTO/getPaginationData.dto';

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


    @Patch("updateBrand/:id")
    @Auth({access_role:[RoleEnum.admin]})
    @UseInterceptors(FileInterceptor("logo",multerCloud({})))
    async updateBrand(
        @Body() data:UpdateBrandDTO,
        @Param() params:IdDto,
        @GetUser() user:UserDocument,
    ){
        const {id} = params;
        return await this.brandService.updateBrand(data,id,user)
    }

    @Get()
    async getBrands(@Query() data:GetPaginationDataDTO){
        return await this.brandService.getAllBrands(data)
    }

    @Delete("softDelete/:id")
    @Auth({access_role:[RoleEnum.admin]})
    async softDeleteBrand(@GetUser() user: UserDocument,@Param() data:IdDto){
        return await this.brandService.softDeleteBrand(user,data)
    }

    @Delete("hardDelete/:id")
    @Auth({access_role:[RoleEnum.admin]})
    async hardDeleteBrand(@GetUser() user: UserDocument,@Param() data:IdDto){
        return await this.brandService.hardDeleteBrand(user,data)
    }

}

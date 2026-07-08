import { BadGatewayException, ConflictException, Injectable } from '@nestjs/common';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { CreateBrandDTO } from './dto/createBrand.dto';
import type { UserDocument } from 'src/DB/models/user.model';
import { S3Service } from 'src/common/services/s3.service';

@Injectable()
export class BrandService {
    constructor(
        private readonly brandRepo : BrandRepository,
        private readonly s3Service : S3Service,

    ){}

    async createBrand(data:CreateBrandDTO,logo:Express.Multer.File,user:UserDocument){
        const {name,slogan} = data

        if(await this.brandRepo.findOne({filter:{name}})){
            throw new ConflictException("Brand Name Already Exist")
        }

        const logoFile = await this.s3Service.uploadFile({
            file:logo,
            path:`brand/${name}`
        })

        const brand = await this.brandRepo.create({
            name,
            slogan,
            logo:logoFile,
            createdBy:user._id
        })

        if(!brand){
            await this.s3Service.deleteFile(logoFile)
            throw new BadGatewayException("failed to create brand, try again later");
        }

        return brand
    }

}

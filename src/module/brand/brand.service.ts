import { 
    BadGatewayException, 
    BadRequestException, 
    ConflictException, 
    Injectable 
} from '@nestjs/common';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { CreateBrandDTO } from './dto/createBrand.dto';
import { User, type UserDocument } from 'src/DB/models/user.model';
import { S3Service } from 'src/common/services/s3.service';
import { UpdateBrandDTO } from './dto/updateBrand.dto';
import { Types } from 'mongoose';
import { GetPaginationDataDTO } from 'src/common/DTO/getPaginationData.dto';
import { IdDto } from 'src/common/DTO/id.dto';
import { randomUUID } from "crypto";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BrandService {
    
    constructor(
        private readonly brandRepo : BrandRepository,
        private readonly s3Service : S3Service,
        private readonly configService:ConfigService,
    ){}

    async createBrand(data:CreateBrandDTO,logo:Express.Multer.File,user:UserDocument){
        const {name,slogan} = data

        if(await this.brandRepo.findOne({filter:{name}})){
            throw new ConflictException("Brand Name Already Exist")
        }

        const folderId = randomUUID()
        console.log({folderId});
        const logoFile = await this.s3Service.uploadFile({
            file:logo,
            path:`brand/${folderId}`
        })

        const brand = await this.brandRepo.create({
            name,
            slogan,
            logo:logoFile,
            createdBy:user._id,
            s3FolderId:String(folderId)
        })

        if(!brand){
            await this.s3Service.deleteFile(logoFile)
            throw new BadGatewayException("failed to create brand, try again later");
        }

        return brand
    }

    async updateBrand(data:UpdateBrandDTO,id:Types.ObjectId ,user:UserDocument){
        const {name,slogan} = data
        let brand = await this.brandRepo.findOne({
            filter:{
                _id:id,
                createdBy:user._id
            }
        })

        if(!brand){
            throw new BadRequestException("Brand Id Not Exist")
        }

        if(name&& name == brand.name){
            throw new ConflictException("name not changed please make any change to update it")
        }
        if(slogan&& slogan == brand.slogan){
            throw new ConflictException("slogan not changed please make any change to update it")
        }

        if(name && await this.brandRepo.findOne({filter:{name}})){
            throw new ConflictException("Brand Name Already Exist")
        }

        brand = await this.brandRepo.findOneAndUpdate({
            filter:{_id:id},
            updateData:{
                name:name?name:brand.name,
                slogan:slogan?slogan:brand.slogan,
            }
        })

        return brand
    }

    async getAllBrands(query:GetPaginationDataDTO){
        const {page,limit,search} = query
        
        const data = await this.brandRepo.paginate({
            page,
            limit,
            search:{
                $or:search?[
                    {name:{$regex:search,$options:"i"}},
                    {slogan:{$regex:search,$options:"i"}},
                ]:[],
                isDeleted:{$ne:true}
            }
        })

        return data
    }

    async softDeleteBrand(user:UserDocument,params:IdDto){
        const {id} = params

        const brand = await this.brandRepo.findOneAndUpdate({
            filter:{
                _id:id,
                createdBy:user._id
            },
            updateData:{isDeleted:true}
        })

        if(!brand){
            throw new BadRequestException("Brand Not exist");
        }

        return brand
    }

    async hardDeleteBrand(user:UserDocument,params:IdDto){
        const {id} = params

        const brand = await this.brandRepo.findOneAndDelete({
            filter:{
                _id:id,
                createdBy:user._id
            }
        })

        if(!brand){
            throw new BadRequestException("Brand Not exist");
        }

        await this.s3Service.deleteFolder(`brand/${brand.s3FolderId}`)

        return brand
    }
}

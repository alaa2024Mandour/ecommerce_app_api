import UserRepository from "../../DB/repositories/user.repository";
import { S3Service } from "src/common/services/s3.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {

    constructor(
        private readonly userRepo: UserRepository,
        private readonly s3Service: S3Service,
    ) { }

    async getAllUsers() {
        return await this.userRepo.find({ filter: {} })
    }

    async uploadProfilePic ({userId,picture}:{userId:string ,picture : Express.Multer.File}){
        this.s3Service.uploadFile({
            file:picture,
            path:`users/${userId}/profilePic`
        })
    }

    async uploadFiles ({userId,files}:{userId:string ,files : Express.Multer.File[]}){
        this.s3Service.uploadFiles({
            files,
            path:`users/${userId}/attachments`
        })
    }

    async uploadProductImages (
        {
            userId,
            files
        }:
        {
            userId:string ,
            files :{ 
                productImage: Express.Multer.File[], 
                productSubImages?: Express.Multer.File[] 
            }
        }
    ){
        let subImages = files.productSubImages || []
        this.s3Service.uploadFiles({
            files:[...files.productImage,...subImages],
            path:`users/${userId}/products`
        })
    }

}
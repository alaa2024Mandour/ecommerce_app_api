import { ConflictException, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "../DB/models/user.model";
import { zodCreateUserDTO } from "./validation/create-user.validation";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDTO } from "./dto/create-user.dto";
import UserRepository from "../DB/repositories/user.repository";
import { EncryptionService } from "src/common/utils/security/encrypt.security";
import { HashingService } from "src/common/utils/security/hash.security";

@Injectable()
export class UserService {

    constructor(
        private readonly userRepo: UserRepository,
        private readonly encryptionService: EncryptionService,
        private readonly hashingService: HashingService,
    ) { }

    async getAllUsers() {
        return await this.userRepo.find({ filter: {} })
    }

    async createUser(data: CreateUserDTO) {
        const { userName, email, phone, gender, password, cPassword } = data
        let user =  await this.userRepo.findOne({filter:{email}})
        if(user){
            throw new ConflictException("this email already exist");
        }
        user = await this.userRepo.create(
            { 
                userName, 
                email, 
                phone: this.encryptionService.encrypt(phone), 
                gender, 
                password : this.hashingService.Hash({plainText:password}) 
            }
        )
        return user
    }

    // deleteUser(name:string):object{
    // }
}
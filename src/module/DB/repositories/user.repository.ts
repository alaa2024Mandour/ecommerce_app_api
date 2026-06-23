import { Model } from "mongoose";
import { User } from "../models/user.model";
import { BaseRepository } from "./base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
class UserRepository extends BaseRepository<User> {
    constructor( @InjectModel(User.name) protected userModel: Model<User>){
        super(userModel)
    }

    async checkUser (email:string){
        const userExist = await this.model.findOne({email});
        return userExist;
    }
}

export default UserRepository;
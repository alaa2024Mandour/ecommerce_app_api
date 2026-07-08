import { Model } from "mongoose";
import { User } from "../models/user.model";
import { BaseRepository } from "./base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Brand } from "../models/brand.model";

@Injectable()
class BrandRepository extends BaseRepository<Brand> {
    constructor( @InjectModel(Brand.name) protected brandModel: Model<Brand>){
        super(brandModel)
    }

}

export default BrandRepository;
import { 
    MongooseModule, 
    Prop, 
    Schema, 
    SchemaFactory
} from "@nestjs/mongoose";
import { 
    HydratedDocument, 
    Types
} from "mongoose";
import slugify  from "slugify";
import { User } from "./user.model";

@Schema()
export class Brand {
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true
    })
    name: string;

    @Prop({
        type: String,
        default:function(this:Brand){
            return slugify(this.name,{replacement:"_",trim:true,lower:true})
        }
    })
    slug: string;

    @Prop({
        type: String,
        required: true,
        trim: true
    })
    slogan:string;

    @Prop({
        type: String,
        trim: true
    })
    logo: string;


    @Prop({
        type: Types.ObjectId,
        ref:User.name,
        required: true,
    })
    createdBy: Types.ObjectId;


    @Prop({
        type: Types.ObjectId,
        ref:User.name,
    })
    updatedBy: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref:User.name,
    })
    deletedBy: Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(Brand)

export type BrandDocument = HydratedDocument<Brand>
export const BrandModel = MongooseModule.forFeature([{name:Brand.name,schema:BrandSchema}])
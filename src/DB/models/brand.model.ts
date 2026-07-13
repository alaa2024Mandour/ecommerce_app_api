import { 
    MongooseModule, 
    Prop, 
    Schema, 
    SchemaFactory
} from "@nestjs/mongoose";
import { 
    HydratedDocument, 
    Types,
    UpdateQuery
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

    @Prop({
        type: Boolean,
    })
    isDeleted: boolean;

    @Prop({
        type:String
    })
    s3FolderId:string
}

export const BrandSchema = SchemaFactory.createForClass(Brand)

export type BrandDocument = HydratedDocument<Brand>
export const BrandModel = MongooseModule.forFeatureAsync([{
    name:Brand.name,
    useFactory:function(){
        const Brand = BrandSchema
        Brand.pre(["updateOne","findOneAndUpdate"],async function(){
            const updatedData =  this.getUpdate() as UpdateQuery<Brand>

            if(updatedData?.name){
                updatedData.slug = slugify(updatedData.name,{replacement:"_",trim:true,lower:true})
            }

        })

        return Brand
    }
}])
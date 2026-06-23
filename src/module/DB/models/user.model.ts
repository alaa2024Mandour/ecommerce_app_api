import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { GenderEnum, RoleEnum } from "src/common/enum/user.enum";

@Schema()
export class User {
    @Prop({
        type:String,
        required:true,
        trim:true
    })
    userName:string;

    @Prop({
        type:String,
        required:true,
        trim:true,
        unique:true,
    })
    email:string;

    @Prop({
        type:String,
        trim:true
    })
    phone:string;

    @Prop({
        type:String,
        required:true,
        trim:true
    })
    password:string;

    @Prop({
        type:String,
        enum:GenderEnum,
        default:GenderEnum.male,
        trim:true
    })
    gender:string;

    @Prop({
        type:String,
        enum:RoleEnum,
        default:RoleEnum.user,
        trim:true
    })
    role:string;
}

export const UserSchema = SchemaFactory.createForClass(User)
export type UserDocument = HydratedDocument<User>
export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
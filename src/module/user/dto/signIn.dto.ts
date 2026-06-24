import { IsEmail, IsNotEmpty, IsString} from "class-validator";


export class signInDTO {

    @IsEmail({}, { message: "this field required email format" })
    @IsNotEmpty()
    email: string;

    @IsString({ message: "password must be string" })
    password: string;
}
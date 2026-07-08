import { 
    IsEmail,
    IsNotEmpty, 
} from "class-validator";


export class forgotPasswordDTO {
    @IsEmail({},{ message: "invalid email format" })
    @IsNotEmpty()
    email: string;
}
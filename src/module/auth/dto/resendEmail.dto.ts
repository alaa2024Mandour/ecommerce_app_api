import { 
    IsEmail,
    IsNotEmpty, 
} from "class-validator";


export class resendEmailDTO {
    @IsEmail({},{ message: "invalid email format" })
    @IsNotEmpty()
    email: string;
}
import { 
    IsNotEmpty, 
    IsString,
    IsStrongPassword, 
} from "class-validator";


export class updatePasswordDTO {
    @IsString({ message: "password must be a string" })
    @IsNotEmpty()
    password: string;

    @IsString({ message: "newPassword must be a string" })
    @IsNotEmpty()
    @IsStrongPassword()
    newPassword: string;
}
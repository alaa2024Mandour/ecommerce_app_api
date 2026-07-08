import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword} from "class-validator";

export class resetPasswordDTO {
    @IsEmail()
    email: string;

    @IsNumber()
    code: number

    @IsString({ message: "newPassword must be a string" })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}
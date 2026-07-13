import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, Length, ValidateIf } from "class-validator";
import { GenderEnum, RoleEnum } from "src/common/enum/user.enum";
import { IsMatch } from "../../../common/decorators/isMatch.decorator";


export class signUpDTO {
    @IsString({ message: "userName must be string" })
    @IsNotEmpty()
    @Length(2, 15)
    userName: string;

    @IsEmail({}, { message: "this field required email format" })
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString({ message: "phone must be string" })
    phone: string;

    @IsNotEmpty()
    @IsString({ message: "gender must be string" })
    @IsEnum(GenderEnum)
    gender: string;

    @IsNotEmpty()
    @IsString({ message: "role must be string" })
    @IsEnum(RoleEnum)
    role?: string;

    @IsStrongPassword()
    password: string;

    // @IsStrongPassword()
    // @Validate(matchPassword)
    @ValidateIf((data)=>{  // Validates the decorated property only if the 'password' field is provided in the request
        return Boolean(data.password)
    })
    @IsMatch(["password"])
    cPassword: string;
}
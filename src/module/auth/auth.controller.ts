import {
    Body,
    Controller,
    Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { signUpDTO } from "./dto/signUp.dto";
import { signInDTO } from "./dto/signIn.dto";
import { updatePasswordDTO } from "./dto/updatePassword.dto";
import { Auth } from "src/common/decorators/auth.decorator";
import { RoleEnum } from "src/common/enum/user.enum";
import { GetUser } from "src/common/decorators/user.decorator";
import type { UserDocument } from "../../DB/models/user.model";
import { forgotPasswordDTO } from "./dto/forgotPassword.dto";
import { ConfirmEmailDTO } from "./dto/confirmEmail.dto";
import { resendEmailDTO } from "./dto/resendEmail.dto";
import { resetPasswordDTO } from "./dto/resetPassword.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post("/signup")
    signUp(@Body()
    body: signUpDTO): object {
        return this.authService.signUp(body)
    }

    @Post("/signin")
    signIn(@Body()
    body: signInDTO
    ): object {
        return this.authService.signIn(body)
    }

    @Post("/updatePassword")
    @Auth({access_role:[RoleEnum.admin,RoleEnum.user]})
    async updatePassword(@GetUser() user:UserDocument, @Body() data:updatePasswordDTO ){
        return await this.authService.updatePassword(user,data)
    }

    @Post("/confirm")
    async confirmEmail(@Body() data:ConfirmEmailDTO ){
        return await this.authService.confirmEmail(data)
    }

    @Post("/resendEmail")
    async resendEmail(@Body() data:resendEmailDTO ){
        return await this.authService.resendEmail(data)
    }

    @Post("/forgotPassword")
    async forgotPassword(@Body() data:forgotPasswordDTO ){
        return await this.authService.forgotPassword(data)
    }

    @Post("/resetPassword")
    async resetPassword(@Body() data:resetPasswordDTO ){
        return await this.authService.resetPassword(data)
    }
}
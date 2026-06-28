import { SetMetadata } from "@nestjs/common"
import { RoleEnum } from '../enum/user.enum';


export const role_key = "role_key" 

export const RoleDecorator = (role :  RoleEnum[] ) => {
    return SetMetadata(role_key,role)
}
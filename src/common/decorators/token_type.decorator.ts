import { SetMetadata } from "@nestjs/common"
import { TokenEnum } from "../enum/token.enum"


export const tokenType_key = "tokenType" 

export const TokenTypeDecorator = (tokenType :  string = TokenEnum.access_token ) => {
    return SetMetadata(tokenType_key,tokenType)
}
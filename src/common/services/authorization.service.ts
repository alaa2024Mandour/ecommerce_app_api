import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenEnum } from "../enum/token.enum";
import UserRepository from "src/module/DB/repositories/user.repository";

@Injectable()
export class AuthorizationService{
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userRepo: UserRepository,
    ){}

    getSignature({prefix, token}:{prefix:string,token:string}){
        let secret_access_token = ""
        let secret_refresh_token = ""

        if (prefix == this.configService.get<string>("jwt.user.prefix")) {
            secret_access_token = this.configService.get<string>("jwt.user.accessSecret")!
            secret_refresh_token = this.configService.get<string>("jwt.user.refreshSecret")!
        }
        else if (prefix == this.configService.get<string>("jwt.admin.prefix")) {
            secret_access_token = this.configService.get<string>("jwt.admin.accessSecret")!
            secret_refresh_token = this.configService.get<string>("jwt.admin.refreshSecret")!
        } 
        else {
            throw new HttpException("invalid signature", 401);
        }
        return {secret_access_token,secret_refresh_token}
    }

    async verifyToken({authorization,tokenType}:{authorization:string,tokenType:string}){
        if (!authorization) {
            throw new BadRequestException("invalid token");
        }

        const [prefix, token] = authorization.split(" ")

        console.log({ prefix, token });

        if (!prefix || !token) {
            throw new BadRequestException("token not exist")
        }

        const  {secret_access_token,secret_refresh_token} = this.getSignature({prefix,token})
        const secret = tokenType == TokenEnum.access_token? secret_access_token: secret_refresh_token

        const payload = this.jwtService.verify(token,{secret})
        const user = await this.userRepo.findById(payload.sub)
        if(!user){
            throw new HttpException("User Not Found",404);
        }
        
        return {payload,user}
    }
}
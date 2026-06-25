import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { TokenEnum } from '../enum/token.enum';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(
        private readonly authorizationService: AuthorizationService
    ) { }
    async use(req: any, res: Response, next: NextFunction) {
        const { authorization } = req.headers

        const {user,payload} = await this.authorizationService.verifyToken({authorization,tokenType:TokenEnum.access_token})
        
        req.user = user
        
        next()
    }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthorizationService } from '../services/authorization.service';
import { Reflector } from '@nestjs/core';
import { tokenType_key } from '../decorators/token_type.decorator';




@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private readonly authorizationService: AuthorizationService,
        private reflector: Reflector
    ){}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const tokenType = this.reflector.get(tokenType_key, context.getHandler());
        
        let req : any ;
        let authorization : string = "";
        if (context.getType()=="http"){
            req = context.switchToHttp().getRequest();
            authorization = req.headers.authorization
        }
        else if (context.getType()=="rpc"){
            // req = context.switchToRpc().getData();
            // authorization 
        }
        else if (context.getType()=="ws"){
            // req = context.switchToWs().getClient();
            // authorization = 
        }

        const { user, payload } = await this.authorizationService.verifyToken({ authorization, tokenType })
        
        req.user = user
        req.payload = payload

        return true
    }
}

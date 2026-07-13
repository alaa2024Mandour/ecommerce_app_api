
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { role_key } from '../decorators/role.decorator';


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ){}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const Roles = this.reflector.get(role_key, context.getHandler());
        
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

        if(! Roles.includes(req.user.role)){
            throw new UnauthorizedException("you can't access this end point");
        }
        
        return true
    }
}

import { RoleEnum } from './../enum/user.enum';
import { TokenEnum } from './../enum/token.enum';

import { applyDecorators, UseGuards } from '@nestjs/common';
import { TokenTypeDecorator } from './token_type.decorator';
import { RoleDecorator } from './role.decorator';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { RoleGuard } from '../guards/role.guard';

export function Auth({ token_type = TokenEnum.access_token, access_role }: { token_type?: TokenEnum , access_role: RoleEnum[]} ) {
    return applyDecorators(
        TokenTypeDecorator(token_type),
        RoleDecorator(access_role),
        UseGuards(AuthorizationGuard, RoleGuard)
    );
}

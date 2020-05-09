import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext) {
        const roles: string[] = this.reflector.get('roles', context.getHandler())
        if (!roles) return true


        const request = context.switchToHttp().getRequest();
        const user = request.user;
        // if (roles.filter(role => userRoles.includes(role)).length >0) {
        //     return true
        // } else {
        //     throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
        // }

        return roles.includes(user.role)
    }
}

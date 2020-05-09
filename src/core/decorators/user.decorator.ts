import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { IUserToken } from "../interfaces/user-token.interface";

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): IUserToken => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

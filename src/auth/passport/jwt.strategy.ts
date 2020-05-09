import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { jwtConstants } from '../constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        });
    }
    async validate(payload: JwtPayload) {
        const result = await this.userService.validateUser(payload);
        if (!result) {
            new UnauthorizedException()
        }
        return result
    }
}

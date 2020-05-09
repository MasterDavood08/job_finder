import { Controller, UseGuards, Post, Request, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IResponse } from 'src/core/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from 'src/core/dto/response.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { SeekerLoginDto } from './dto/seeker-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/core/guards/role.guard';
import { Roles } from 'src/core/decorators/role.decorator';
import { GetUser } from 'src/core/decorators/user.decorator';
import { EmployerLoginDto } from './dto/employer-login.dto';
import { IUserToken } from 'src/core/interfaces/user-token.interface';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private usersService: UsersService) { }

    @Post('login/seeker')
    async seekerLogin(@Body() seekerLoginDto: SeekerLoginDto): Promise<IResponse> {
        try {
            const email = await this.usersService.checkEmailValidated(seekerLoginDto.email);
            let token;
            if (email) {
                token = await this.authService.validateSeekerLoginWithPassword(seekerLoginDto);
            } else {
                token = await this.authService.validateSeekerLoginWithActivationCode(seekerLoginDto);
            }

            return new ResponseSuccess("LOGIN.SUCCESS", { token });
        } catch (error) {
            return new ResponseError("LOGIN.ERROR", error);
        }
    }


    @Post('login/employer')
    async employerLogin(@Body() employerLoginDto: EmployerLoginDto): Promise<IResponse> {
        try {
            const email = await this.usersService.checkEmailValidated(employerLoginDto.email);
            let token;
            if (email) {
                token = await this.authService.validateEmployerLoginWithPassword(employerLoginDto);
            } else {
                token = await this.authService.validateEmployerLoginWithActivationCode(employerLoginDto);
            }

            return new ResponseSuccess("LOGIN.SUCCESS", { token });
        } catch (error) {
            return new ResponseError("LOGIN.ERROR", error);
        }
    }



    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
        try {
            const user = await this.usersService.createNewUser(createUserDto);

            const usePass = user.emailValidated

            if (!usePass) {
                await this.authService.sendActivationCode(user);
            }

            return new ResponseSuccess('REGISTERATION.SUCCESS', { password: usePass })

        } catch (error) {
            return new ResponseError("REGISTER.ERROR", error);
        }
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('seeker', 'employer')
    async profile(@GetUser() user: IUserToken): Promise<IResponse> {
        return new ResponseSuccess("OK", new UserDto(user))
    }
}

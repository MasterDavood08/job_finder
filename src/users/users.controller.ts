import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { IResponse } from 'src/core/interfaces/response.interface';
import { ResponseSuccess } from 'src/core/dto/response.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) { }

    @Get(':id/profile')
    async getUsersProfile(@Param('id', ParseIntPipe) userId): Promise<IResponse> {
        try {
            const userProfile = await this.usersService.getUsersProfile(userId);
            return new ResponseSuccess('Users.Get_profile', userProfile)
        } catch (e) {

        }

    }
}

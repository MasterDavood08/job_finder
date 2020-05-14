import { Controller, Put, Body, UseGuards, Get } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { GetUser } from 'src/core/decorators/user.decorator';
import { IUserToken } from 'src/core/interfaces/user-token.interface';
import { UpdateEmployerProfileDto } from './dto/update-employer-profile.dto';
import { IResponse } from 'src/core/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from 'src/core/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('employers')
@UseGuards(AuthGuard('jwt'))
export class EmployersController {
    constructor(private employersService: EmployersService) { }

    @Put('/profile')
    @Roles(Role.EMPLOYER)
    async updateEmployerProfile(@GetUser() user: IUserToken, @Body() employerData: UpdateEmployerProfileDto): Promise<IResponse> {
        try {
            const employer = await this.employersService.updateEmployerProfile(user, employerData)
            return new ResponseSuccess('EMPLOYER.UPDATED', employer)

        } catch (e) {
            return new ResponseError('EMPLOYER.UPDATE_ERROR', e)
        }
    }


    @Get('/profile')
    @Roles(Role.EMPLOYER)
    async getEmployerProfile(@GetUser() user: IUserToken): Promise<IResponse> {
        try {
            const employer = await this.employersService.getEmployerProfile(user.id)
            return new ResponseSuccess('EMPLOYER.GET_EMPLOYER', employer)

        } catch (e) {
            return new ResponseError('EMPLOYER.GET_ERROR', e)
        }
    }
}

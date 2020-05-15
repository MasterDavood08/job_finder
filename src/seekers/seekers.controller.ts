import { Controller, Put, Body, UseGuards, Get, Query } from '@nestjs/common';
import { SeekersService } from './seekers.service';
import { UpdateSeekerProfileDto } from './dto/update-seeker-profile.dto';
import { IResponse } from 'src/core/interfaces/response.interface';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { GetUser } from 'src/core/decorators/user.decorator';
import { IUserToken } from 'src/core/interfaces/user-token.interface';
import { ResponseSuccess, ResponseError } from 'src/core/dto/response.dto';
import { RolesGuard } from 'src/core/guards/role.guard';
import { IPaginationOptions } from 'src/core/pagination';

@Controller('seekers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SeekersController {
    constructor(private seekersService: SeekersService) { }


    @Put('/profile')
    @Roles(Role.SEEKER)
    async updateSeekerProfile(@GetUser() user: IUserToken, @Body() seekerData: UpdateSeekerProfileDto): Promise<IResponse> {
        try {
            const seeker = await this.seekersService.updateSeekerProfile(user, seekerData)
            return new ResponseSuccess('SEEKER.UPDATED', seeker)

        } catch (e) {
            return new ResponseError('SEEKER.UPDATE_ERROR', e)
        }
    }


    @Get('/profile')
    @Roles(Role.SEEKER)
    async getSeekerProfile(@GetUser() user: IUserToken): Promise<IResponse> {
        try {
            const seeker = await this.seekersService.getSeekerProfile(user.id)
            return new ResponseSuccess('SEEKER.GET_SEEKER', seeker)

        } catch (e) {
            return new ResponseError('SEEKER.GET_ERROR', e)
        }
    }


    @Get('/requests')
    @Roles(Role.SEEKER)
    async getjobRequest(@GetUser() user: IUserToken, @Query() options: IPaginationOptions): Promise<IResponse> {
        try {
            const requests = await this.seekersService.getJobRequests(user.seekerOrEmployerId, options)
            return new ResponseSuccess('SEEKER.GET_Requests', requests)

        } catch (e) {
            return new ResponseError('SEEKER.GET_Requests_ERROR', e)
        }
    }


}

import { Controller, Put, Body, UseGuards, Get, Post, Options, Query, Param, ParseIntPipe } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { Roles } from 'src/core/decorators/role.decorator';
import { Role } from 'src/core/enums/role.enum';
import { GetUser } from 'src/core/decorators/user.decorator';
import { IUserToken } from 'src/core/interfaces/user-token.interface';
import { UpdateEmployerProfileDto } from './dto/update-employer-profile.dto';
import { IResponse } from 'src/core/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from 'src/core/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/core/guards/role.guard';
import { IPaginationOptions } from 'src/core/pagination';

@Controller('employers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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

    @Get('/jobs')
    @Roles(Role.EMPLOYER)
    async getEmployerJobs(@GetUser() user: IUserToken, @Query() options: IPaginationOptions): Promise<IResponse> {
        try {
            const jobs = await this.employersService.getEmployerJobs(user.id, options)
            return new ResponseSuccess('EMPLOYER.GET_EMPLOYER_JOBS', jobs)

        } catch (e) {
            return new ResponseError('EMPLOYER.GET_EMPLOYER_JOBS_ERROR', e)
        }
    }


    @Get('/jobs/:id')
    @Roles(Role.EMPLOYER)
    async getEmployerJob(@GetUser() user: IUserToken, @Param('id', ParseIntPipe) jobId: number): Promise<IResponse> {
        try {
            const jobs = await this.employersService.getEmployerJob(user.id, jobId)
            return new ResponseSuccess('EMPLOYER.GET_EMPLOYER_JOB', jobs)

        } catch (e) {
            return new ResponseError('EMPLOYER.GET_EMPLOYER_JOB_ERROR', e)
        }
    }

}

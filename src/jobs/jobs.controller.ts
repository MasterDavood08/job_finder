import { Controller, Post, UseGuards, Get, Param, ParseIntPipe, Body, Query, Put } from '@nestjs/common';
import { Roles } from 'src/core/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/core/enums/role.enum';
import { IResponse } from 'src/core/interfaces/response.interface';
import { JobsService } from './jobs.service';
import { GetUser } from 'src/core/decorators/user.decorator';
import { IUserToken } from 'src/core/interfaces/user-token.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { ResponseSuccess, ResponseError } from 'src/core/dto/response.dto';
import { IPaginationOptions } from 'src/core/pagination';
import { RolesGuard } from 'src/core/guards/role.guard';
import { UpdateJobOfferDto } from './dto/update-job-message.dto';

@Controller('jobs')
export class JobsController {

    constructor(private jobsService: JobsService) { }

    @Get()
    async getJobs(@Query() options: IPaginationOptions): Promise<IResponse> {
        try {
            const jobs = await this.jobsService.getJobs(options)
            return new ResponseSuccess('get_jobs', jobs)
        } catch (error) {
            return new ResponseError('get_jobs_error', error)
        }
    }

    @Get('/:id')
    async getJobById(@Param('id', ParseIntPipe) id: number): Promise<IResponse> {
        try {
            const job = await this.jobsService.getJobById(id)
            return new ResponseSuccess('get_job', job)
        } catch (error) {
            return new ResponseError('get_job_error', error)
        }
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.EMPLOYER)
    async createJob(@GetUser() user: IUserToken, @Body() createJobDto: CreateJobDto): Promise<IResponse> {
        try {
            const job = await this.jobsService.createJob(user.seekerOrEmployerId, createJobDto)
            return new ResponseSuccess('add_job', job)
        } catch (error) {
            return new ResponseError('add_job_error', error)
        }

    }

    @Post(':jobId/apply')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SEEKER)
    async jobRequest(@GetUser() user: IUserToken, @Param('jobId', ParseIntPipe) jobId: number): Promise<IResponse> {
        try {
            await this.jobsService.jobRequest(user.seekerOrEmployerId, jobId)
            return new ResponseSuccess('apply_job')
        } catch (error) {
            return new ResponseError('apply_job', error)
        }

    }


    @Put('/:id/offers/:offerId')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.EMPLOYER)
    async getEmployerJob(@GetUser() user: IUserToken, @Param('id', ParseIntPipe) jobId: number, @Param('offerId', ParseIntPipe) offerId: number, @Body() jobOfferDto: UpdateJobOfferDto): Promise<IResponse> {
        try {
            const offer = await this.jobsService.updateJobOfferForEmployer(user.id, jobId, offerId, jobOfferDto.message)
            return new ResponseSuccess('Update_Employer_Job_offer', offer)

        } catch (e) {
            return new ResponseError('Update_Employer_Job_offer_ERROR', e)
        }
    }

    // @Delete('/:id')
    // async deleteJob(@Param('id', ParseIntPipe) id: number): Promise<IResponse> {}

    // @Put('/:id')
    // async updateJob(@Param('id', ParseIntPipe) id: number, @Body() jobData): Promise<IResponse> {}


}

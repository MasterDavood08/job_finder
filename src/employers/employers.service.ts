import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerRepository } from './employer.repository';
import { User } from 'src/users/user.entity';
import { UpdateEmployerProfileDto } from './dto/update-employer-profile.dto';
import { IUserToken } from 'src/core/interfaces/user-token.interface';
import { Employer } from './employer.entity';
import { IPaginationOptions, Pagination } from 'src/core/pagination';
import { Job } from 'src/jobs/job.entity';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class EmployersService {

    constructor(
        @InjectRepository(EmployerRepository)
        private employerRepository: EmployerRepository,
        private jobsService: JobsService
    ) { }

    async updateEmployerProfile(user: IUserToken, employerData: UpdateEmployerProfileDto): Promise<Employer> {
        await this.employerRepository.update(user.seekerOrEmployerId, employerData);
        const employer = await this.employerRepository.findOne(user.seekerOrEmployerId);

        return employer
    }

    async getEmployerProfile(id: number): Promise<Employer> {
        const employer = await this.employerRepository.findOne(id);
        return employer
    }

    async getEmployerJobs(id: number, options: IPaginationOptions): Promise<Pagination<Job>> {
        return this.jobsService.getEmployerJobs(id, options)
    }


    async getEmployerJob(id: number, jobId: number): Promise<Job> {
        return this.jobsService.getEmployerJob(id, jobId)
    }

    async assignUser(user: User): Promise<void> {
        await this.employerRepository.save({ user })
    }
}

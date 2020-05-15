import { Injectable } from '@nestjs/common';
import { SeekerRepository } from './seeker.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UpdateSeekerProfileDto } from './dto/update-seeker-profile.dto';
import { Seeker } from './seeker.entity';
import { IUserToken } from 'src/core/interfaces/user-token.interface';
import { Offer } from 'src/jobs/offer/offer.entity';
import { Pagination, IPaginationOptions } from 'src/core/pagination';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class SeekersService {

    constructor(
        @InjectRepository(SeekerRepository)
        private seekerRepository: SeekerRepository,
        private jobsService: JobsService
    ) { }

    async updateSeekerProfile(user: IUserToken, seekerProfileData: UpdateSeekerProfileDto): Promise<Seeker> {
        await this.seekerRepository.update(user.seekerOrEmployerId, seekerProfileData);
        const seeker = await this.seekerRepository.findOne(user.seekerOrEmployerId);

        return seeker
    }

    async getSeekerProfile(id: number): Promise<Seeker> {
        const seeker = await this.seekerRepository.findOne(id);
        return seeker
    }

    async getJobRequests(id: number, options: IPaginationOptions): Promise<Pagination<Offer>> {
        const requests = await this.jobsService.getRequestsBySeeker(id, options)
        return requests
    }

    async assignUser(user: User): Promise<void> {
        await this.seekerRepository.save({ user })
    }

}

import { Injectable } from '@nestjs/common';
import { SeekerRepository } from './seeker.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UpdateSeekerProfileDto } from './dto/update-seeker-profile.dto';
import { Seeker } from './seeker.entity';
import { IUserToken } from 'src/core/interfaces/user-token.interface';

@Injectable()
export class SeekersService {

    constructor(
        @InjectRepository(SeekerRepository)
        private seekerRepository: SeekerRepository
    ) { }

    async updateSeekerProfile(user: IUserToken, seekerProfileData: UpdateSeekerProfileDto): Promise<Seeker> {
        await this.seekerRepository.update(user.seekerOrEmployerId, seekerProfileData);
        const seeker = await this.seekerRepository.findOne(user.seekerOrEmployerId);

        return seeker
    }

    async assignUser(user: User): Promise<void> {
        await this.seekerRepository.save({ user })
    }

}

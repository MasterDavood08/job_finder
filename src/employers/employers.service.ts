import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerRepository } from './employer.repository';
import { User } from 'src/users/user.entity';
import { UpdateEmployerProfileDto } from './dto/update-employer-profile.dto';
import { IUserToken } from 'src/core/interfaces/user-token.interface';
import { Employer } from './employer.entity';

@Injectable()
export class EmployersService {

    constructor(
        @InjectRepository(EmployerRepository)
        private employerRepository: EmployerRepository
    ) { }

    async updateSeekerProfile(user: IUserToken, employerData: UpdateEmployerProfileDto): Promise<Employer> {
        await this.employerRepository.update(user.seekerOrEmployerId, employerData);
        const employer = await this.employerRepository.findOne(user.seekerOrEmployerId);

        return employer
    }

    async assignUser(user: User): Promise<void> {
        await this.employerRepository.save({ user })
    }
}

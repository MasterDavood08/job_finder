import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from './user.entity';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { IUserToken } from 'src/core/interfaces/user-token.interface';
import { Role } from 'src/core/enums/role.enum';
import { SeekersService } from 'src/seekers/seekers.service';
import { EmployersService } from 'src/employers/employers.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private seekersService: SeekersService,
        private employersService: EmployersService,
    ) { }


    async createNewUser(createUserDto: CreateUserDto): Promise<User> {

        const [user, created] = await this.userRepository.findOrCreteUser(createUserDto.email, createUserDto.isSeeker);

        if (created) {
            if (createUserDto.isSeeker) {
                await this.seekersService.assignUser(user)
            } else {
                await this.employersService.assignUser(user)
            }
        }

        return user
    }

    async checkEmailValidated(email: string) {
        const validated = this.userRepository.isValidatedEmail(email);
        return validated
    }

    async validateUser(jwtPayload: JwtPayload) {
        const user = await this.userRepository.findOne({ email: jwtPayload.email }, { relations: ['seeker', 'employer'] })
        if (!user) return null;
        const token: IUserToken = {
            id: user.id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            seekerOrEmployerId: user.role === Role.SEEKER ? user.seeker.id : user.employer.id,
            role: user.role
        }
        return token
    }
}

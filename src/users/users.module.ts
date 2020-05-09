import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { SeekersService } from 'src/seekers/seekers.service';
import { EmployersService } from 'src/employers/employers.service';
import { SeekerRepository } from 'src/seekers/seeker.repository';
import { EmployerRepository } from 'src/employers/employer.repository';

@Module({
    controllers: [UsersController],
    providers: [UsersService, SeekersService, EmployersService],
    exports: [UsersService],
    imports: [TypeOrmModule.forFeature([UserRepository, SeekerRepository, EmployerRepository])]
})
export class UsersModule {
}

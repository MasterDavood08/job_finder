import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { SeekersModule } from 'src/seekers/seekers.module';
import { EmployersModule } from 'src/employers/employers.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
    imports: [TypeOrmModule.forFeature([UserRepository]), SeekersModule, EmployersModule]
})
export class UsersModule {
}

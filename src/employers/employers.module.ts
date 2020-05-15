import { Module } from '@nestjs/common';
import { EmployersController } from './employers.controller';
import { EmployersService } from './employers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerRepository } from './employer.repository';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerRepository]), JobsModule],
  controllers: [EmployersController],
  providers: [EmployersService],
  exports: [EmployersService]
})
export class EmployersModule { }

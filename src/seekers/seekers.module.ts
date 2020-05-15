import { Module } from '@nestjs/common';
import { SeekersController } from './seekers.controller';
import { SeekersService } from './seekers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeekerRepository } from './seeker.repository';
import { JobsService } from 'src/jobs/jobs.service';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([SeekerRepository]), JobsModule],
  controllers: [SeekersController],
  providers: [SeekersService],
  exports: [SeekersService]
})
export class SeekersModule { }

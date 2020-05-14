import { Module } from '@nestjs/common';
import { SeekersController } from './seekers.controller';
import { SeekersService } from './seekers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeekerRepository } from './seeker.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SeekerRepository])],
  controllers: [SeekersController],
  providers: [SeekersService],
  exports: [SeekersService]
})
export class SeekersModule { }

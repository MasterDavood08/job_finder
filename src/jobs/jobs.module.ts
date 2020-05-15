import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRepository } from './job.repository';
import { OfferRepository } from './offer/offer.repository';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [TypeOrmModule.forFeature([JobRepository, OfferRepository])],
  exports: [JobsService]
})
export class JobsModule { }

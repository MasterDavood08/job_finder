import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { JobRepository } from './job.repository';
import { CreateJobDto } from './dto/create-job.dto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IPaginationOptions, Pagination, paginate } from 'src/core/pagination';
import { OfferRepository } from './offer/offer.repository';
import { Offer } from './offer/offer.entity';
@Injectable()
export class JobsService {

    constructor(
        @InjectRepository(JobRepository)
        private jobRepository: JobRepository,
        @InjectRepository(OfferRepository)
        private offerRepository: OfferRepository,
    ) { }

    async getJobs(/*getJobsDto: GetJobsFilterDto**/options: IPaginationOptions): Promise<Pagination<Job>> {
        return paginate<Job>(this.jobRepository, options, { relations: ['employer'] }, null)
    }

    async getEmployerJobs(employerId: number, options: IPaginationOptions): Promise<Pagination<Job>> {
        return paginate<Job>(this.jobRepository, options, { where: { employer: { id: employerId } } }, null)
    }

    async getEmployerJob(employerId: number, jobId: number): Promise<Job> {
        const job = await this.jobRepository.findOne({
            where: {
                id: jobId,
                employer: { id: employerId, }
            },
            relations: ['offers', 'offers.seeker']
        })
        if (!job) throw new NotFoundException('چنین کاری یافت نشد')
        return job

    }

    async updateJobOfferForEmployer(employerId: number, jobId: number, offerId: number, message: string): Promise<Offer> {
        const offer = await this.offerRepository.findOne({
            where: {
                id: jobId,
                job: { id: offerId, employer: { id: employerId } },
            }
        })

        if (!offer) throw new NotFoundException('چنین درخواست کاری یافت نشد')

        offer.message = message;
        return offer.save()
    }


    async getJobById(id: number): Promise<Job> {
        return this.jobRepository.findOne(id, { relations: ['employer'] })
    }

    async createJob(employerId: number, createJobDto: CreateJobDto): Promise<Job> {
        return this.jobRepository.create({ employer: { id: employerId }, ...createJobDto }).save()
    }

    async jobRequest(seekerId: number, jobId: number): Promise<void> {
        const job = await this.jobRepository.findOne(jobId)
        if (!job) throw new NotFoundException('چنین شغلی وجود ندارد')
        const offer = await this.offerRepository.findOne({ where: { job, seeker: { id: seekerId } } })
        if (offer) throw new BadRequestException('چنین درخواستی قبلا ثبت شده')
        await this.offerRepository.create({ job, seeker: { id: seekerId } }).save()
    }


    async getRequestsBySeeker(seekerId: number, options: IPaginationOptions): Promise<Pagination<Offer>> {
        return paginate<Offer>(this.offerRepository, options, { where: { seeker: { id: seekerId } }, relations: ['job', 'job.employer'] }, null)
    }


    // async deleteJob(id: number): Promise<void> {}

    // async updateJob(id: number,JobData): Promise<Job> {}
}

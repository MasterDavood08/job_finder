import { Entity, Column, ManyToOne, RelationId, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/core/entity/base.entity';
import { Job } from '../job.entity';
import { Seeker } from 'src/seekers/seeker.entity';

@Entity()
export class Offer extends BaseEntity {

    @Column("character varying", {
        name: "message",
        nullable: true,
        length: 500,
        default: 'در دست بررسی'
    })
    message: string;

    @ManyToOne(() => Job, job => job.offers)
    @JoinColumn({ name: 'fk_job' })
    public job!: Job;
    @RelationId((offer: Offer) => offer.job)
    jobId: number

    @ManyToOne(() => Seeker, seeker => seeker.requests)
    @JoinColumn({ name: 'fk_seeker' })
    public seeker!: Seeker;
    @RelationId((offer: Offer) => offer.seeker)
    seekerId: number
}

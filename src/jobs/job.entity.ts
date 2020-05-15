import { Entity, Column, OneToMany, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { BaseEntity } from 'src/core/entity/base.entity';
import { Employer } from 'src/employers/employer.entity';
import { Offer } from './offer/offer.entity';

@Entity()
export class Job extends BaseEntity {


    @Column("character varying", {
        name: "job_title",
        nullable: true,
        length: 200
    })
    jobTitle: string;

    @Column("character varying", {
        name: "job_description",
        nullable: true,
        length: 1000
    })
    jobDescription: string;

    @Column("character varying", {
        name: "salary",
        nullable: true,
        length: 500
    })
    salary: string;

    @Column("simple-array", {
        name: "tags",
        nullable: true,
        default: []
    })
    tags: string[];

    @OneToMany(() => Offer, offer => offer.job)
    offers: Offer[];

    @ManyToOne(() => Employer, employer => employer.jobs)
    @JoinColumn([{ name: "fk_employer" }])
    employer: Employer;
    @RelationId((job: Job) => job.employer)
    employerId: number
}

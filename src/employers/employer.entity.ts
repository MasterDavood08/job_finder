import { Entity, OneToOne, JoinColumn, RelationId, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/core/entity/base.entity';
import { User } from 'src/users/user.entity';
import { Job } from 'src/jobs/job.entity';

@Entity()
export class Employer extends BaseEntity {

    //owner details
    @Column("character varying", {
        name: "full_name",
        nullable: true,
        length: 200
    })
    fullName: string;

    @Column("character varying", {
        name: "city",
        nullable: true,
        length: 50
    })
    city: string;

    @Column("character varying", {
        name: "summary",
        nullable: true,
        length: 200
    })
    summary: string;

    @Column("simple-array", {
        name: "contacts",
        nullable: true,
        default: []
    })
    contacts: string[];

    //company details
    @Column("character varying", {
        name: "company_name",
        nullable: true,
        length: 50
    })
    companyName: string;

    @Column("character varying", {
        name: "company_url",
        nullable: true,
        length: 100
    })
    companyUrl: string;

    @Column("character varying", {
        name: "company_email",
        nullable: true,
        length: 50
    })
    companyEmail: string;

    @Column("character varying", {
        name: "about_company",
        nullable: true,
        length: 50
    })
    aboutCompany: string;

    @Column("simple-array", {
        name: "tags",
        nullable: true,
        default: []
    })
    tags: string[];

    @Column("character varying", {
        name: "company_address",
        nullable: true,
        length: 150
    })
    companyAddress: string;


    @OneToOne(() => User, user => user.employer)
    @JoinColumn({ name: "fk_user" })
    user: User;
    @RelationId((employer: Employer) => employer.user)
    userId: number

    @OneToMany(() => Job, job => job.employer
    )
    jobs: Job[];
}

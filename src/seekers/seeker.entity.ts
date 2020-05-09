import { Entity, Column, OneToOne, JoinColumn, RelationId } from 'typeorm';
import { BaseEntity } from 'src/core/entity/base.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Seeker extends BaseEntity {

    @Column("character varying", {
        name: "full_name",
        nullable: true,
        length: 200
    })
    fullName: string;

    @Column("character varying", {
        name: "general",
        nullable: true,
        length: 500
    })
    general: string;

    @Column("simple-array", {
        name: "contacts",
        nullable: true,
        default: []
    })
    contacts: string[];

    @Column("simple-array", {
        name: "experience",
        nullable: true,
        default: []
    })
    experience: string[];

    @Column("simple-array", {
        name: "education",
        nullable: true,
        default: []
    })
    education: string[];

    @Column('jsonb', {
        name: "ksao",
        nullable: true,
        default: []
    })
    ksao: { name: string, description: string }[];

    @Column("simple-array", {
        name: "tags",
        nullable: true,
        default: []
    })
    tags: string[];

    @OneToOne(() => User, user => user.seeker)
    @JoinColumn({ name: "fk_user" })
    user: User;
    @RelationId((seeker: Seeker) => seeker.user)
    userId: number

}

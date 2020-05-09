import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { UserPassword } from './password/user-password.entity';

import { BaseEntity } from 'src/core/entity/base.entity';
import { Role } from 'src/core/enums/role.enum';
import { Seeker } from 'src/seekers/seeker.entity';
import { Employer } from 'src/employers/employer.entity';

@Entity()
export class User extends BaseEntity {
    @Column("character varying", {
        name: "activation_code",
        nullable: true,
        length: 36
    })
    activationCode: string | null;

    @Column("timestamp with time zone", {
        name: "activation_code_expires_at",
        nullable: true
    })
    activationCodeExpiresAt: Date | null;

    @Column("json", { name: "password_reset_code", nullable: true })
    passwordResetCode: object | null;

    @Column("timestamp with time zone", {
        name: "password_reset_code_expired_at",
        nullable: true
    })
    passwordResetCodeExpiredAt: Date | null;

    @Column("timestamp with time zone", {
        name: "can_not_login_until",
        nullable: true
    })
    canNotLoginUntil: Date | null;

    @Column("boolean", { name: "is_logged_in", default: () => "false" })
    isLoggedIn: boolean;

    @Column("timestamp with time zone", {
        name: "last_login_date",
        nullable: true
    })
    lastLoginDate: Date | null;

    @Column("character varying", {
        name: "last_ip_address",
        nullable: true,
        length: 50
    })
    lastIpAddress: string | null;

    @Column("character varying", { name: "username", unique: true, length: 50 })
    username: string;

    @Column("character varying", {
        name: "email",
        nullable: true,
        unique: true,
        length: 100
    })
    email: string | null;

    @Column("boolean", {
        name: "email_validated",
        nullable: true,
        default: () => "false"
    })
    emailValidated: boolean | null;

    @Column("character varying", {
        name: "phone_number",
        nullable: true,
        unique: true,
        length: 20
    })
    phoneNumber: string | null;

    @Column("boolean", {
        name: "phone_validated",
        nullable: true,
        default: false
    })
    phoneValidated: boolean | null;

    @Column("numeric", {
        name: "failed_login_attempts",
        nullable: true,
        default: () => 0
    })
    failedLoginAttempts: number | null;

    @Column("boolean", { name: "is_active", default: () => "true" })
    isActive: boolean;


    @Column("text", { name: "push_ids", nullable: true, array: true })
    pushIds: string[] | null;

    @OneToMany(() => UserPassword, userPassword => userPassword.user // * be ID na Be Entity
    )
    userPasswords: UserPassword[];

    @Column({
        type: "enum",
        name: "role",
        enum: Role,
        // default: OrderStatus.NoStatus
    })
    role: Role

    @OneToOne(() => Seeker, seeker => seeker.user)
    seeker: Seeker;

    @OneToOne(() => Employer, employer => employer.user)
    employer: Employer;
}

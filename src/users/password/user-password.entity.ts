import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from "typeorm";
import { User } from "../user.entity";
import { BaseEntity } from "src/core/entity/base.entity";

@Entity("user_password")
export class UserPassword extends BaseEntity {
    @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
    id: number;

    @Column("character varying", {
        name: "hashed_password",
        nullable: true,
        length: 512
    })
    hashedPassword: string | null;

    @Column("boolean", { name: "is_active", default: () => "true" })
    isActive: boolean;


    @ManyToOne(
        () => User,
        user => user.userPasswords,
        { onDelete: "SET NULL", onUpdate: "CASCADE" }
    )
    @JoinColumn([{ name: "fk_user", referencedColumnName: "id" }])
    user: User;
    @RelationId((userPass: UserPassword) => userPass.user)
    userId: number
}

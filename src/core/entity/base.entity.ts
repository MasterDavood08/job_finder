import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity as Base, DeleteDateColumn, ObjectType, FindConditions } from 'typeorm';

export class BaseEntity extends Base {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn({ nullable: true, name: 'created_at' })
    createdAt?: Date;

    @UpdateDateColumn({ nullable: true, name: 'updated_at' })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    public deletedAt: Date

    static async findOrCreate<T extends BaseEntity>(this: ObjectType<T>, conditions: FindConditions<T>): Promise<T> {
        let self = this as any;
        let entity = await self.findOne(conditions);
        if (!entity) {
            entity = new self();
            Object.assign(entity, conditions);
            await entity.save();
        }
        return entity;
    }
}

import { CreateDateColumn, DeleteDateColumn, BaseEntity as TypeOrmBaseEntity, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity extends TypeOrmBaseEntity {

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleteAt: Date | null;
}
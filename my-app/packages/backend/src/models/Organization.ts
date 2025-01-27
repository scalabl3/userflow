import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './User';

@Entity()
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, default: 'shadow', nullable: true })
    name!: string;

    @Column({ default: false })
    visible!: boolean;

    @Column({ type: 'uuid' })
    adminUser!: string;

    @OneToMany(() => User, user => user.organizationId)
    users!: User[];

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
}

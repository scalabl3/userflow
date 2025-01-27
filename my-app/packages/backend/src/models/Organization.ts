import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, default: 'shadow', nullable: true })
    name: string;

    @Column({ default: true })
    visible: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    modifiedAt: Date;

    @Column({ type: 'uuid' })
    adminUser: string;
}

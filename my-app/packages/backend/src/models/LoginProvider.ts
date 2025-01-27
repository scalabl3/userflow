import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class LoginProvider {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true })
    code!: string;  // e.g., "email", "google", "phone"

    @Column({ type: 'varchar' })
    name!: string;  // Display name

    @Column({ type: 'boolean', default: true })
    isEnabled!: boolean;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
} 
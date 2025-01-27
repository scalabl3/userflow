import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { IsOptional, IsString, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { User } from './User';

export enum PrivacyLevel {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    CONTACTS_ONLY = 'CONTACTS_ONLY'
}

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', nullable: true })
    @IsOptional()
    @IsString()
    bio?: string;

    @Column({ type: 'varchar', nullable: true })
    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @Column('simple-json', { nullable: true })
    @IsOptional()
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        [key: string]: string | undefined;
    };

    @Column({
        type: 'enum',
        enum: PrivacyLevel,
        default: PrivacyLevel.PUBLIC
    })
    @IsEnum(PrivacyLevel)
    privacyLevel!: PrivacyLevel;

    @OneToOne(() => User, user => user.profile)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ type: 'uuid' })
    @IsUUID()
    userId!: string;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
}

import { Entity, Column } from 'typeorm';
import { BaseUser } from './BaseUser';

@Entity()
export class User extends BaseUser {
    @Column({ type: 'varchar', unique: true })
    username!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'boolean', default: false })
    isEmailVerified!: boolean;

    @Column({ type: 'varchar', nullable: true })
    phoneNumber?: string;

    @Column({ type: 'boolean', default: false })
    isPhoneVerified!: boolean;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    @Column({ type: 'uuid' })
    organizationId!: string;

    @Column('simple-json', { nullable: true })
    preferences?: {
        theme?: 'light' | 'dark';
        notifications?: {
            email?: boolean;
            push?: boolean;
        };
    };

    setDefaultPreferences() {
        if (!this.preferences) {
            this.preferences = {
                theme: 'light',
                notifications: {
                    email: true,
                    push: true
                }
            };
        }
    }
}

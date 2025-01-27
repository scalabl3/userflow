import { Entity, Column } from 'typeorm';
import { BaseUser } from './BaseUser';

@Entity()
export class User extends BaseUser {
    @Column({ type: 'varchar', unique: true })
    username!: string;

    @Column({ type: 'varchar' })
    displayname!: string;

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

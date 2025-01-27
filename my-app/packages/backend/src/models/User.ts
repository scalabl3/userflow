import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { BaseUser } from './BaseUser';
import { Organization } from './Organization';

@Entity()
export class User extends BaseUser {
    @ManyToOne(() => Organization)
    organization!: Organization;
   
    @Column({ nullable: true })
    organizationId!: string;

    // Profile will be implemented later
    @Column({ nullable: true })
    profileId!: string;

    @Column('simple-json', { 
        nullable: true
    })
    preferences!: {
        theme?: 'light' | 'dark';
        notifications?: {
            email?: boolean;
            push?: boolean;
        };
    };

    @BeforeInsert()
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

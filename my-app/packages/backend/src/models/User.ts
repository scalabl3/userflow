import { Entity, Column, OneToMany } from 'typeorm';
import { BaseUser } from './BaseUser';
import { Profile } from './Profile'; // Assuming Profile will be implemented later

@Entity()
export class User extends BaseUser {
    @Column({ type: 'jsonb', nullable: true })
    preferences?: Record<string, any>;

    @OneToMany(() => Profile, profile => profile.user)
    profiles!: Profile[];
}

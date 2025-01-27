import { Expose } from 'class-transformer';
import { ResponseBaseUserDto } from '../BaseUser/ResponseBaseUserDto';

export class ResponseUserDto extends ResponseBaseUserDto {
    @Expose()
    organizationId!: string;

    @Expose()
    preferences!: {
        theme?: 'light' | 'dark';
        notifications?: {
            email?: boolean;
            push?: boolean;
        };
    };

    // Profile ID will be exposed when Profile entity is implemented
    @Expose()
    profileId?: string;
}

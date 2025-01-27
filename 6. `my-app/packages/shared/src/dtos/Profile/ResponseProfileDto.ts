import { Expose } from 'class-transformer';
import { PrivacyLevel } from '@my-app/backend/dist/models/Profile';

export class ResponseProfileDto {
    @Expose()
    id!: string;

    @Expose()
    bio?: string;

    @Expose()
    avatarUrl?: string;

    @Expose()
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        [key: string]: string | undefined;
    };

    @Expose()
    privacyLevel!: PrivacyLevel;

    @Expose()
    userId!: string;

    @Expose()
    createdAt!: Date;

    @Expose()
    modifiedAt!: Date;
}

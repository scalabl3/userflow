import { IsOptional, IsString, IsEnum, ValidateNested } from 'class-validator';
import { PrivacyLevel } from '@my-app/backend/dist/models/Profile';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    socialLinks?: {
        @IsOptional()
        @IsString()
        twitter?: string;

        @IsOptional()
        @IsString()
        linkedin?: string;

        @IsOptional()
        @IsString()
        github?: string;

        [key: string]: string | undefined;
    };

    @IsOptional()
    @IsEnum(PrivacyLevel)
    privacyLevel?: PrivacyLevel;
}

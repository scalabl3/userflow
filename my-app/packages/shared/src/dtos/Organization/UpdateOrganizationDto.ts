import { IsString, IsOptional, IsBoolean, IsUUID, Length } from 'class-validator';

export class UpdateOrganizationDto {
    @IsString()
    @Length(1, 255)
    @IsOptional()
    name?: string;

    @IsBoolean()
    @IsOptional()
    visible?: boolean;

    @IsUUID()
    @IsOptional()
    adminUser?: string;
}

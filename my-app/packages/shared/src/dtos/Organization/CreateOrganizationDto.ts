import { IsString, IsOptional, IsBoolean, IsUUID, Length } from 'class-validator';

export class CreateOrganizationDto {
    @IsString()
    @Length(1, 255)
    name!: string;

    @IsBoolean()
    @IsOptional()
    visible?: boolean;

    @IsUUID()
    adminUser!: string;
}

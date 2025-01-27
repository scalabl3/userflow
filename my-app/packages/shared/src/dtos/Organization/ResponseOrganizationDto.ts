import { IsString, IsBoolean, IsUUID, IsDate, Length } from 'class-validator';

export class ResponseOrganizationDto {
    @IsUUID()
    id!: string;

    @IsString()
    @Length(1, 255)
    name!: string;

    @IsBoolean()
    visible!: boolean;

    @IsDate()
    createdAt!: Date;

    @IsDate()
    modifiedAt!: Date;

    @IsUUID()
    adminUser!: string;
}

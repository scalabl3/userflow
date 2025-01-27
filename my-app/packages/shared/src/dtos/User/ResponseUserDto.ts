import { IsString, IsUUID } from 'class-validator';

export class ResponseUserDto {
    @IsUUID()
    id!: string;

    @IsString()
    firstname!: string;

    @IsString()
    lastname!: string;

    @IsString()
    displayname!: string;

    @IsString()
    contactEmail!: string;

    preferences?: Record<string, any>;
}

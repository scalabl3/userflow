export class ResponseBaseUserDto {
    id!: string;
    firstname!: string;
    lastname!: string;
    displayname!: string;
    contactEmail!: string;
    state!: string;
    primaryLoginCredentialId?: string;
    lastLoginAt?: Date;
    isEnabled!: boolean;
    createdAt!: Date;
    modifiedAt!: Date;
}

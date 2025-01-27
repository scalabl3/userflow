import { CredentialType } from './CreateLoginCredentialDto';

export class ResponseLoginCredentialDto {
    id!: string;
    identifier!: string;
    loginProviderId!: string;
    credentialType!: CredentialType;
    expiresAt?: Date;
    isEnabled!: boolean;
    createdAt!: Date;
    modifiedAt!: Date;
}

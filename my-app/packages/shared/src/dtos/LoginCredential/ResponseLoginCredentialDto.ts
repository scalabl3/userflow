import { Expose, Type } from 'class-transformer';
import { CredentialType, OAuthProvider } from '../../enums/CredentialType';
import { ResponseLoginProviderDto } from '../LoginProvider/ResponseLoginProviderDto';

export class ResponseLoginCredentialDto {
    @Expose()
    id!: string;

    @Expose()
    identifier!: string;

    @Expose()
    loginProviderId!: string;

    @Expose()
    @Type(() => ResponseLoginProviderDto)
    loginProvider?: ResponseLoginProviderDto;

    @Expose()
    credentialType!: CredentialType;

    @Expose()
    isEnabled!: boolean;

    // Password-specific fields (only exposed for PASSWORD type)
    @Expose()
    hasPassword?: boolean;  // Indicates if password is set

    // OAuth-specific fields (only exposed for OAUTH type)
    @Expose()
    provider?: OAuthProvider;  // The specific OAuth provider

    @Expose()
    accessTokenExpiresAt?: Date;

    @Expose()
    hasRefreshToken?: boolean;  // Indicates if refresh token exists

    @Expose()
    refreshTokenExpiresAt?: Date;

    @Expose()
    scope?: string;

    @Expose()
    rawProfile?: Record<string, any>;

    // Apple-specific indicators
    @Expose()
    hasIdentityToken?: boolean;  // Indicates if Apple identity token exists

    @Expose()
    hasAuthorizationCode?: boolean;  // Indicates if Apple auth code exists

    @Expose()
    realUserStatus?: string;  // Apple's real user status

    @Expose()
    baseUserId?: string;

    @Expose()
    createdAt!: Date;

    @Expose()
    modifiedAt!: Date;
}

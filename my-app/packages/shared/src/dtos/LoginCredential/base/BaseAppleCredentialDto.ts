import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';
import { BaseOAuthCredentialDto } from './BaseOAuthCredentialDto';
import { StandardString } from '../../../utils/dto-utils';
import { OAuthProvider } from '../../../enums/CredentialType';

/**
 * Base class for Apple OAuth credential DTOs
 */
export class BaseAppleCredentialDto extends BaseOAuthCredentialDto {
    // Override provider to be specifically APPLE
    @ApiProperty({
        description: 'OAuth provider type',
        enum: OAuthProvider,
        example: OAuthProvider.APPLE,
        enumName: 'OAuthProvider'
    })
    provider: OAuthProvider = OAuthProvider.APPLE;

    @ApiProperty({
        description: 'Apple identity token',
        example: 'eyJraWQ...',
        format: 'jwt'
    })
    @IsJWT({ message: 'Must be a valid JWT token' })
    identityToken!: string;

    @StandardString({
        description: 'Apple authorization code',
        example: 'c8ef...',
        required: true,
        minLength: 1,
        maxLength: 1000
    })
    authorizationCode!: string;

    @StandardString({
        description: 'Apple\'s real user status',
        example: '2',
        required: true,
        minLength: 1,
        maxLength: 50
    })
    realUserStatus!: string;

    @StandardString({
        description: 'Apple nonce used for token verification',
        example: 'abc123...',
        required: true,
        minLength: 1,
        maxLength: 1000
    })
    nonce!: string;
} 
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CredentialType } from '../../../enums/CredentialType';
import { EnableableDto } from '../../base/BaseDto';
import { StandardString, RelationshipId } from '../../../utils/dto-utils';

/**
 * Base class for all login credential DTOs
 */
export class BaseLoginCredentialDto extends EnableableDto {
    @StandardString({
        description: 'Identifier used for authentication (email, phone, etc.)',
        example: 'user@example.com',
        required: true,
        minLength: 1,
        maxLength: 255
    })
    identifier!: string;

    @RelationshipId({
        description: 'ID of the associated login provider',
        required: true
    })
    loginProviderId!: string;

    @RelationshipId({
        description: 'ID of the associated base user',
        required: true
    })
    baseUserId!: string;

    @ApiProperty({
        description: 'Type of credential',
        enum: CredentialType,
        example: CredentialType.PASSWORD,
        enumName: 'CredentialType'
    })
    @IsEnum(CredentialType, { message: 'Must be a valid credential type' })
    credentialType!: CredentialType;
} 
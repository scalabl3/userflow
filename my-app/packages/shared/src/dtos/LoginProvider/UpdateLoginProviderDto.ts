import { ApiProperty } from '@nestjs/swagger';
import { EnableableDto } from '../base/BaseDto';
import { StandardString } from '../../utils/dto-utils';

export class UpdateLoginProviderDto extends EnableableDto {
    @StandardString({
        description: 'Provider code (e.g., "email", "google", "phone")',
        example: 'google',
        required: false,
        minLength: 1,
        maxLength: 50
    })
    code?: string;

    @StandardString({
        description: 'Display name of the provider',
        example: 'Google',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    name?: string;
}

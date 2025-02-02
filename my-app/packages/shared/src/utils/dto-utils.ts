import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsArray, ValidateNested, IsString, Length } from 'class-validator';
import { Expose, Type } from 'class-transformer';

/**
 * Helper for creating standard relationship ID field decorators
 */
export function RelationshipId(options: {
    description: string;
    required?: boolean;
    example?: string;
} = {
    description: 'Related entity ID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000'
}) {
    return function(target: any, propertyKey: string) {
        // API Documentation
        ApiProperty({
            description: options.description,
            example: options.example,
            required: options.required,
            format: 'uuid'
        })(target, propertyKey);

        // Validation
        IsUUID(undefined, { message: 'Must be a valid UUID' })(target, propertyKey);
        if (!options.required) {
            IsOptional()(target, propertyKey);
        }
    };
}

/**
 * Helper for creating standard relationship array ID field decorators
 */
export function RelationshipIds(options: {
    description: string;
    required?: boolean;
    example?: string[];
} = {
    description: 'Related entity IDs',
    required: false,
    example: ['123e4567-e89b-12d3-a456-426614174000']
}) {
    return function(target: any, propertyKey: string) {
        // API Documentation
        ApiProperty({
            description: options.description,
            example: options.example,
            required: options.required,
            type: [String],
            format: 'uuid'
        })(target, propertyKey);

        // Validation
        IsArray({ message: 'Must be an array of UUIDs' })(target, propertyKey);
        IsUUID(undefined, { 
            each: true,
            message: 'Each value must be a valid UUID'
        })(target, propertyKey);
        if (!options.required) {
            IsOptional()(target, propertyKey);
        }
    };
}

/**
 * Helper for creating standard relationship object field decorators in Response DTOs
 */
export function RelationshipObject<T extends new (...args: any[]) => any>(options: {
    type: T;
    description: string;
    required?: boolean;
    isArray?: boolean;
}) {
    return function(target: any, propertyKey: string) {
        // Class Transform
        Expose()(target, propertyKey);
        Type(() => options.type)(target, propertyKey);

        // API Documentation
        const apiOptions: ApiPropertyOptions = {
            description: options.description,
            required: options.required,
            type: options.isArray ? [options.type] : () => options.type
        };
        ApiProperty(apiOptions)(target, propertyKey);

        // Validation for nested objects
        ValidateNested({ each: options.isArray })(target, propertyKey);
    };
}

/**
 * Helper for creating standard string field decorators
 */
export function StandardString(options: {
    description: string;
    required?: boolean;
    example: string;
    minLength?: number;
    maxLength?: number;
}) {
    return function(target: any, propertyKey: string) {
        // API Documentation
        ApiProperty({
            description: options.description,
            example: options.example,
            required: options.required,
            minLength: options.minLength || 1,
            maxLength: options.maxLength || 255
        })(target, propertyKey);

        // Validation
        IsString({ message: 'Must be a string' })(target, propertyKey);
        Length(
            options.minLength || 1,
            options.maxLength || 255,
            { message: `Length must be between ${options.minLength || 1} and ${options.maxLength || 255} characters` }
        )(target, propertyKey);
        if (!options.required) {
            IsOptional()(target, propertyKey);
        }
    };
} 
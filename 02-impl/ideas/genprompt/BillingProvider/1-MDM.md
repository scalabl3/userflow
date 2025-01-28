# BillingProvider Generation - Phase 1: MDM

## Aider Command Line
```bash
gouserflow && rm -rf .aider.tags.cache.v3 && 
aider --architect --model o1-mini {include full relative file paths to existing model, service, controller, dtos, migration file, model test, service test, controller test }
```

## Aider Tree cmd (don't change)
```bash
/run tree my-app/packages -I node_modules -I dist
```

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this first phase is to generate the core entity model, its essential DTOs, and migration. Focus on proper data modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Entity Specification
BillingProvider is a standalone entity that represents a payment or billing service provider (e.g., Stripe, PayPal). Similar to LoginProvider, it:
- Has a unique identifier and name
- Maintains configuration and credentials
- Can be enabled/disabled
- Stores provider-specific settings

Required Features:
- Provider type enumeration (STRIPE, PAYPAL, etc.)
- Secure credential storage
- Configuration validation
- Enable/disable functionality
- Audit timestamps

### Files to Generate

1. Model (`my-app/packages/backend/src/models/BillingProvider.ts`)
   - Entity definition with decorators
   - Column constraints and indices
   - Related interfaces/types

2. DTOs (`my-app/packages/shared/src/dtos/BillingProvider/`)
   - CreateBillingProviderDto.ts
   - ResponseBillingProviderDto.ts

3. Migration (`my-app/packages/backend/src/migrations/<timestamp>_<order>_CreateBillingProvider.ts`)
   - Table creation
   - Indices
   - Constraints

### Verification Checklist
- [ ] Entity follows TypeORM patterns with proper decorators
- [ ] Proper @Index decorators for unique columns
- [ ] Comprehensive JSDoc documentation
- [ ] Proper null handling with TypeScript strict mode
- [ ] Column constraints and defaults properly set
- [ ] DTOs have comprehensive OpenAPI examples
- [ ] DTOs have proper validation messages
- [ ] Migration includes proper indices
- [ ] Migration has proper up/down methods
- [ ] All imports are properly organized and exist

### File Generation Guidelines

#### Model Guidelines
- Use `@Index` decorators for unique columns
- Organize imports: TypeORM first, class-validator, others
- Include comprehensive JSDoc documentation
- Export related interfaces and types
- Use proper null handling
- Include proper column constraints and defaults

#### DTO Guidelines
Create DTOs:
- Include comprehensive OpenAPI examples
- Include proper validation messages
- Organize imports properly
- Use class-validator decorators

Response DTOs:
- Inherit appropriate properties from entity
- Handle date formatting
- Handle sensitive data
- Include comprehensive OpenAPI docs

#### Migration Guidelines
- Create proper indices
- Include comprehensive column constraints
- Set appropriate default values
- Include proper down migration
- Use transactions
- Follow naming convention: <timestamp>_<order>_Create<EntityName>.ts

### Entity Model Stub
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsJSON } from 'class-validator';
import { BillingProviderType } from '../enums/BillingProviderType';

/**
 * BillingProvider entity represents a payment service provider integration.
 * It maintains provider configuration, credentials, and operational status.
 */
@Entity('billing_provider')
export class BillingProvider {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    name: string;

    @Column({ type: 'varchar', nullable: true })
    @IsOptional()
    description?: string;

    @Column({ type: 'varchar', nullable: false })
    @IsEnum(BillingProviderType)
    @IsNotEmpty()
    providerType: BillingProviderType;

    @Column({ type: 'json', nullable: true })
    @IsOptional()
    @IsJSON()
    configuration?: Record<string, any>;

    @Column({ type: 'json', nullable: true })
    @IsOptional()
    @IsJSON()
    credentials?: Record<string, any>;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    modifiedAt: Date;
}
```

### Create DTO Stub
```typescript
import { IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingProviderType } from '../../enums/BillingProviderType';

export class CreateBillingProviderDto {
    @ApiProperty({
        description: 'The name of the billing provider',
        example: 'Stripe Production',
    })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({
        description: 'Optional description of the billing provider',
        example: 'Production Stripe integration for payments',
        required: false,
    })
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The type of billing provider',
        enum: BillingProviderType,
        example: BillingProviderType.STRIPE,
    })
    @IsNotEmpty({ message: 'Provider type is required' })
    @IsEnum(BillingProviderType)
    providerType: BillingProviderType;

    @ApiProperty({
        description: 'Provider-specific configuration',
        example: { webhookUrl: 'https://api.example.com/webhooks/stripe' },
        required: false,
    })
    @IsOptional()
    @IsJSON()
    configuration?: Record<string, any>;

    @ApiProperty({
        description: 'Provider credentials (encrypted)',
        example: { apiKey: 'sk_test_...' },
        required: false,
    })
    @IsOptional()
    @IsJSON()
    credentials?: Record<string, any>;

    @ApiProperty({
        description: 'Whether the provider is enabled',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;
}
```

### Response DTO Stub
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { BillingProviderType } from '../../enums/BillingProviderType';

@Exclude()
export class ResponseBillingProviderDto {
    @Expose()
    @ApiProperty({
        description: 'The unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @Expose()
    @ApiProperty({
        description: 'The name of the billing provider',
        example: 'Stripe Production',
    })
    name: string;

    @Expose()
    @ApiProperty({
        description: 'Description of the billing provider',
        example: 'Production Stripe integration for payments',
    })
    description?: string;

    @Expose()
    @ApiProperty({
        description: 'The type of billing provider',
        enum: BillingProviderType,
        example: BillingProviderType.STRIPE,
    })
    providerType: BillingProviderType;

    @Expose()
    @ApiProperty({
        description: 'Provider-specific configuration',
        example: { webhookUrl: 'https://api.example.com/webhooks/stripe' },
    })
    configuration?: Record<string, any>;

    @Expose()
    @ApiProperty({
        description: 'Whether the provider is enabled',
        example: true,
    })
    isEnabled: boolean;

    @Expose()
    @ApiProperty({
        description: 'The creation timestamp',
        example: '2024-01-27T12:00:00Z',
    })
    createdAt: Date;

    @Expose()
    @ApiProperty({
        description: 'The last modification timestamp',
        example: '2024-01-27T12:00:00Z',
    })
    modifiedAt: Date;
}
```

### Migration Stub
```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateBillingProvider_<timestamp>_<order> implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'billing_provider',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'providerType',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'configuration',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'credentials',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'modifiedAt',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
                indices: [
                    new TableIndex({
                        name: 'IDX_BILLING_PROVIDER_NAME',
                        columnNames: ['name'],
                        isUnique: true,
                    }),
                    new TableIndex({
                        name: 'IDX_BILLING_PROVIDER_TYPE',
                        columnNames: ['providerType'],
                    }),
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('billing_provider');
    }
}
``` 

# BillingProfile Entity Generation

## Phase 1: MDM (Model, DTOs, Migration)

### Entity Model Stub
```typescript
/**
 * BillingProfile entity represents the billing information and preferences for a user or organization.
 * It maintains payment methods, billing addresses, and invoicing preferences.
 */
@Entity('billing_profile')
export class BillingProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    name: string;

    @Column({ type: 'varchar', nullable: true })
    @IsOptional()
    description?: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    billingEmail: string;

    @Column({ type: 'varchar', nullable: true })
    @IsOptional()
    billingPhone?: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    addressLine1: string;

    @Column({ type: 'varchar', nullable: true })
    @IsOptional()
    addressLine2?: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    city: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    state: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    postalCode: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty()
    country: string;

    @Column({ type: 'varchar', nullable: true })
    @IsOptional()
    taxId?: string;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled: boolean;

    @Column({ type: 'uuid', nullable: false })
    @IsUUID()
    @IsNotEmpty()
    ownerId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    modifiedAt: Date;
}
```

### Create DTO
```typescript
import { IsNotEmpty, IsOptional, IsUUID, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillingProfileDto {
    @ApiProperty({
        description: 'The name of the billing profile',
        example: 'Company HQ Billing',
    })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({
        description: 'Optional description of the billing profile',
        example: 'Main billing profile for company headquarters',
        required: false,
    })
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Email address for billing communications',
        example: 'billing@company.com',
    })
    @IsNotEmpty({ message: 'Billing email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    billingEmail: string;

    @ApiProperty({
        description: 'Phone number for billing contact',
        example: '+1-555-123-4567',
        required: false,
    })
    @IsOptional()
    billingPhone?: string;

    @ApiProperty({
        description: 'Primary address line',
        example: '123 Business Ave',
    })
    @IsNotEmpty({ message: 'Address line 1 is required' })
    addressLine1: string;

    @ApiProperty({
        description: 'Secondary address line',
        example: 'Suite 456',
        required: false,
    })
    @IsOptional()
    addressLine2?: string;

    @ApiProperty({
        description: 'City name',
        example: 'San Francisco',
    })
    @IsNotEmpty({ message: 'City is required' })
    city: string;

    @ApiProperty({
        description: 'State or province',
        example: 'CA',
    })
    @IsNotEmpty({ message: 'State is required' })
    state: string;

    @ApiProperty({
        description: 'Postal code',
        example: '94105',
    })
    @IsNotEmpty({ message: 'Postal code is required' })
    postalCode: string;

    @ApiProperty({
        description: 'Country name',
        example: 'United States',
    })
    @IsNotEmpty({ message: 'Country is required' })
    country: string;

    @ApiProperty({
        description: 'Tax ID or VAT number',
        example: '12-3456789',
        required: false,
    })
    @IsOptional()
    taxId?: string;

    @ApiProperty({
        description: 'Whether the billing profile is enabled',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;

    @ApiProperty({
        description: 'The ID of the owner (user or organization)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty({ message: 'Owner ID is required' })
    @IsUUID()
    ownerId: string;
}
```

### Response DTO
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseBillingProfileDto {
    @Expose()
    @ApiProperty({
        description: 'The unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @Expose()
    @ApiProperty({
        description: 'The name of the billing profile',
        example: 'Company HQ Billing',
    })
    name: string;

    @Expose()
    @ApiProperty({
        description: 'Description of the billing profile',
        example: 'Main billing profile for company headquarters',
    })
    description?: string;

    @Expose()
    @ApiProperty({
        description: 'Email address for billing communications',
        example: 'billing@company.com',
    })
    billingEmail: string;

    @Expose()
    @ApiProperty({
        description: 'Phone number for billing contact',
        example: '+1-555-123-4567',
    })
    billingPhone?: string;

    @Expose()
    @ApiProperty({
        description: 'Primary address line',
        example: '123 Business Ave',
    })
    addressLine1: string;

    @Expose()
    @ApiProperty({
        description: 'Secondary address line',
        example: 'Suite 456',
    })
    addressLine2?: string;

    @Expose()
    @ApiProperty({
        description: 'City name',
        example: 'San Francisco',
    })
    city: string;

    @Expose()
    @ApiProperty({
        description: 'State or province',
        example: 'CA',
    })
    state: string;

    @Expose()
    @ApiProperty({
        description: 'Postal code',
        example: '94105',
    })
    postalCode: string;

    @Expose()
    @ApiProperty({
        description: 'Country name',
        example: 'United States',
    })
    country: string;

    @Expose()
    @ApiProperty({
        description: 'Tax ID or VAT number',
        example: '12-3456789',
    })
    taxId?: string;

    @Expose()
    @ApiProperty({
        description: 'Whether the billing profile is enabled',
        example: true,
    })
    isEnabled: boolean;

    @Expose()
    @ApiProperty({
        description: 'The ID of the owner',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    ownerId: string;

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

### Migration
```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateBillingProfile_<timestamp>_<order> implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'billing_profile',
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
                        name: 'billingEmail',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'billingPhone',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'addressLine1',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'addressLine2',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'city',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'state',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'postalCode',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'country',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'taxId',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    {
                        name: 'ownerId',
                        type: 'uuid',
                        isNullable: false,
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
                        name: 'IDX_BILLING_PROFILE_OWNER',
                        columnNames: ['ownerId'],
                    }),
                    new TableIndex({
                        name: 'IDX_BILLING_PROFILE_EMAIL',
                        columnNames: ['billingEmail'],
                    }),
                ],
                foreignKeys: [
                    {
                        columnNames: ['ownerId'],
                        referencedTableName: 'user',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('billing_profile');
    }
}
```

## Phase 2: SDT (Service, DTOs, Tests)

### Update DTO
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateBillingProfileDto } from './CreateBillingProfileDto';

export class UpdateBillingProfileDto extends PartialType(CreateBillingProfileDto) {}
```

### Service Implementation Notes
- Implement standard CRUD operations
- Add methods for:
  - Finding profiles by owner
  - Validating billing information
  - Checking for duplicate billing emails
- Use transactions for updates involving payment methods
- Implement proper error handling for constraint violations

### Test Cases to Cover
- CRUD operations
- Duplicate email handling
- Invalid address validation
- Owner relationship validation
- Transaction rollback scenarios
- Enable/disable functionality

## Phase 3: CTT (Controller, Tests)

### Controller Implementation Notes
- Use `/api/billing-profile` base path
- Implement standard CRUD endpoints
- Add specialized endpoints:
  - GET `/api/billing-profile/owner/:ownerId`
  - PUT `/api/billing-profile/:id/validate`
- Include proper authorization guards
- Add rate limiting for validation endpoints

### Test Cases to Cover
- All CRUD endpoints
- Authorization scenarios
- Rate limiting behavior
- Error responses
- Input validation
- Response format validation 
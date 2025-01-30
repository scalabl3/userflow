import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { BillingProviderType } from '@my-app/shared/dist/enums/BillingProviderType';
import { getIdColumn, getTimestampColumns, getEnumColumn } from './helpers';

/**
 * Creates the billing_provider table with standardized columns.
 * 
 * Core Fields:
 * - UUID primary key with standard generation
 * - Name: Provider display name
 *   - Length constrained to 255 chars
 *   - Required and unique
 *   - Used in UI and reporting
 * - Type: Provider type enum
 *   - Required classification
 *   - Used for provider-specific logic
 * 
 * State Management:
 * - Enabled flag for provider activation
 * - Visible flag for UI display
 *   - Controls availability in user interfaces
 *   - Can be hidden for deprecated providers
 * 
 * Relationships:
 * - Will be referenced by billing_account (future)
 * - Will be referenced by payment_method (future)
 * 
 * Indices:
 * - Unique index on name for lookups
 * - Type index for filtering (common query pattern)
 */
export class Create_BillingProvider_1737964200_020000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'billing_provider',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        isUnique: true,  // Each provider name must be unique
                    },
                    getEnumColumn('type', Object.values(BillingProviderType), false),
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        default: true,
                        isNullable: false,  // Must explicitly be enabled/disabled
                    },
                    {
                        name: 'visible',
                        type: 'boolean',
                        default: true,
                        isNullable: false,  // Must explicitly be visible/hidden
                    },
                    ...getTimestampColumns(queryRunner)
                ],
                indices: [
                    {
                        name: 'IDX_BILLING_PROVIDER_NAME',
                        columnNames: ['name'],
                        isUnique: true,  // Enforce unique names
                    },
                    {
                        name: 'IDX_BILLING_PROVIDER_TYPE',
                        columnNames: ['type'],  // Common filter in queries
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('billing_provider');
    }
}

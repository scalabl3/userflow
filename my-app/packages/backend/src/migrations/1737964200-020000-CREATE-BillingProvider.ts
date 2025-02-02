import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { getIdColumn, getTimestampColumns } from './helpers';

/**
 * Creates the billing_provider table with standardized columns.
 * This table serves as the source of truth for valid provider types.
 * 
 * Core Fields:
 * - UUID primary key with standard generation
 * - Type: Provider identifier (e.g., 'STRIPE', 'PAYPAL')
 *   - Required and unique
 *   - Used for provider identification and display
 *   - Source of truth for valid provider types
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
 * Initial Providers:
 * - STRIPE: Credit card processing
 * - PAYPAL: Digital wallet payments
 * - APPLE_PAY: Mobile payments
 * - GOOGLE_PAY: Mobile payments
 */
export class Create_BillingProvider_1737964200_020000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'billing_provider',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'type',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        default: true,
                        isNullable: false
                    },
                    {
                        name: 'visible',
                        type: 'boolean',
                        default: true,
                        isNullable: false
                    },
                    ...getTimestampColumns(queryRunner)
                ],
                indices: [
                    {
                        name: 'IDX_BILLING_PROVIDER_TYPE',
                        columnNames: ['type'],
                        isUnique: true
                    }
                ]
            }),
            true
        );

        // Seed initial provider types
        await queryRunner.manager.insert('billing_provider', [
            { type: 'STRIPE', isEnabled: true, visible: true },
            { type: 'PAYPAL', isEnabled: true, visible: true },
            { type: 'APPLE_PAY', isEnabled: true, visible: true },
            { type: 'GOOGLE_PAY', isEnabled: true, visible: true }
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('billing_provider');
    }
}

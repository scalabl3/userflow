import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { getIdColumn, getTimestampColumns } from './helpers';

/**
 * Creates the login_provider table with standardized columns and constraints.
 * 
 * Core Fields:
 * - UUID primary key with standard generation
 * - Code: Unique provider identifier (e.g., 'google', 'apple')
 *   - Length constrained to 50 chars
 *   - Used in URLs and configs
 * - Name: Display name for the provider
 *   - Length constrained to 255 chars
 *   - Used in UI
 * - Enabled flag for provider activation
 * 
 * Relationships:
 * - Has many LoginCredentials (prevented from deletion if credentials exist)
 * 
 * Indices:
 * - Unique index on code for fast lookups and constraint
 */
export class CreateLoginProvider1737964200001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'login_provider',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'code',
                        type: 'varchar',
                        length: '50',  // Standardized length for provider codes
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',  // Standardized length for display names
                        isNullable: false,
                    },
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        isNullable: false,
                        default: true,  // Providers are enabled by default
                    },
                    ...getTimestampColumns(queryRunner)
                ],
                indices: [
                    {
                        name: 'IDX_LOGIN_PROVIDER_CODE',  // Standardized index naming
                        columnNames: ['code'],
                        isUnique: true
                    }
                ],
                // No foreign keys - this is a root entity
                // Other entities reference this via FK constraints
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('login_provider');
    }
} 
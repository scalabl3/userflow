import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { UserState } from '@my-app/shared/dist/enums/UserState';
import { getIdColumn, getTimestampColumns, getEnumColumn } from './helpers';

/**
 * Creates the base_user table with standardized columns.
 * This is the parent table for all user types in the system.
 * 
 * Core Fields:
 * - UUID primary key with standard generation
 * - Name fields (first, last) for display
 *   - Length constrained to 255 chars
 *   - Required fields
 * - Contact email with uniqueness constraint
 *   - Length constrained to 255 chars
 *   - Required for notifications
 * 
 * State Management:
 * - State enum for user lifecycle (active, suspended, etc.)
 * - Enabled flag for access control
 * - Last login tracking
 * 
 * Relationships:
 * - Extended by User table (concrete implementation)
 * - Has many LoginCredentials (defined in credentials migration)
 * 
 * Indices:
 * - Unique index on contact email
 * - Index on state for filtering
 */
export class CreateBaseUser1737964200004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'base_user',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'firstname',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'lastname',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'contactEmail',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        isUnique: true,
                    },
                    getEnumColumn('state', Object.values(UserState), false),
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        isNullable: false,
                        default: true,  // Users start enabled
                    },
                    {
                        name: 'lastLoginAt',
                        type: 'datetime',
                        isNullable: true,  // Null until first login
                    },
                    ...getTimestampColumns(queryRunner)
                ],
                indices: [
                    {
                        name: 'IDX_BASE_USER_EMAIL',
                        columnNames: ['contactEmail'],
                        isUnique: true
                    },
                    {
                        name: 'IDX_BASE_USER_STATE',
                        columnNames: ['state']
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('base_user');
    }
}

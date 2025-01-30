import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { getIdColumn, getTimestampColumns, getManyToOneRelation, getJsonColumn } from './helpers';

/**
 * Creates the user table with standardized columns and relationships.
 * This extends BaseUser with organization-specific functionality.
 * 
 * Core Fields:
 * - UUID primary key with standard generation
 * - Username: Unique identifier for login
 *   - Length constrained to 255 chars
 *   - Required and unique
 * - Display name: User's preferred name
 *   - Length constrained to 255 chars
 *   - Required for UI
 * 
 * Relationships:
 * - Many-to-One with Organization (SET NULL on delete)
 *   - Required relationship
 *   - Users become unaffiliated if org is deleted
 * - Inherits from BaseUser (handled by TypeORM)
 *   - All base fields (name, email, state)
 *   - All base relationships (credentials)
 * 
 * JSON Data:
 * - Preferences: User-specific settings
 *   - Theme preferences
 *   - Notification settings
 *   - Defaults provided
 * 
 * Indices:
 * - Unique index on username
 * - Index on organization for filtering
 */
export class Create_User_1737964200_011000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Get organization relationship configuration
        const orgRelation = getManyToOneRelation(
            'organizationId',
            'organization',
            true,  // required
            'SET NULL'  // users become unaffiliated if org is deleted
        );

        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'username',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'displayname',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    // Organization relationship using helper
                    new TableColumn(orgRelation.column),
                    // Preferences as structured JSON
                    new TableColumn(
                        getJsonColumn(queryRunner, 'preferences', true, {
                            theme: 'light',
                            notifications: {
                                email: true,
                                push: true
                            }
                        })
                    ),
                    ...getTimestampColumns(queryRunner)
                ],
                indices: [
                    {
                        name: 'IDX_USER_USERNAME',
                        columnNames: ['username'],
                        isUnique: true
                    },
                    {
                        name: 'IDX_USER_ORGANIZATION',
                        columnNames: ['organizationId']
                    }
                ],
                foreignKeys: [
                    orgRelation.constraint
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from 'typeorm';
import { getIdColumn, getTimestampColumns, getOneToOneRelation } from './helpers';

/**
 * Creates the organization table with standardized columns and relationships.
 * 
 * Core Fields:
 * - UUID primary key with standard generation
 * - Name: Organization display name
 *   - Length constrained to 255 chars
 *   - Nullable with 'shadow' default for initial creation
 * - Visible flag for public visibility
 * 
 * Relationships:
 * - One-to-One with BaseUser for admin (RESTRICT delete)
 *   - Required relationship
 *   - Unique constraint
 *   - Protected from deletion
 * - One-to-Many with User (defined in User migration)
 * 
 * Indices:
 * - Unique index on adminUserId for 1:1 relationship
 * - Name uniqueness only enforced when visible=true
 */
export class CreateOrganization1737964200006 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Get admin user relationship configuration
        const adminUserRelation = getOneToOneRelation(
            'adminUserId',
            'base_user',  // Reference base_user since User extends it
            true,  // Required relationship
            true,  // Enforce uniqueness
            'RESTRICT'  // Prevent deletion of admin user
        );

        await queryRunner.createTable(
            new Table({
                name: 'organization',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        default: `'shadow'`,  // Default for initial creation
                    },
                    {
                        name: 'visible',
                        type: 'boolean',
                        isNullable: false,
                        default: false,  // Organizations start hidden
                    },
                    // Admin user relationship using helper
                    new TableColumn(adminUserRelation.column),
                    ...getTimestampColumns(queryRunner)
                ],
                indices: [
                    {
                        name: 'IDX_ORGANIZATION_ADMIN_USER',
                        columnNames: ['adminUserId'],
                        isUnique: true  // Enforce 1:1 relationship
                    },
                    {
                        name: 'IDX_ORGANIZATION_VISIBLE_NAME',
                        columnNames: ['visible', 'name'],
                        where: 'visible = true'  // Only enforce uniqueness for visible orgs
                    }
                ],
                foreignKeys: [
                    new TableForeignKey(adminUserRelation.constraint)
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('organization');
    }
}

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { getSoftDeletionColumn } from './helpers';

/**
 * Adds soft deletion capability to all entities
 * 
 * Changes:
 * - Adds to all entities:
 *   - deleted: boolean flag (default false)
 *   - deletedAt: timestamp when deletion occurred
 * 
 * Affected Tables:
 *   - BaseUser
 *   - LoginCredential
 *   - LoginProvider
 *   - Organization
 * 
 * Note: User table inherits from BaseUser, so it gets soft deletion automatically
 */
export class AddSoftDeleteFields1738084610030000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const softDeleteColumn = getSoftDeletionColumn(queryRunner);
        const deletedColumn = new TableColumn({
            name: 'deleted',
            type: 'boolean',
            default: false
        });

        // Add to BaseUser
        await queryRunner.addColumns('base_user', [
            deletedColumn,
            new TableColumn(softDeleteColumn)
        ]);

        // Add to LoginCredential
        await queryRunner.addColumns('login_credential', [
            deletedColumn,
            new TableColumn(softDeleteColumn)
        ]);

        // Add to LoginProvider
        await queryRunner.addColumns('login_provider', [
            deletedColumn,
            new TableColumn(softDeleteColumn)
        ]);

        // Add to Organization
        await queryRunner.addColumns('organization', [
            deletedColumn,
            new TableColumn(softDeleteColumn)
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove from Organization
        await queryRunner.dropColumn('organization', 'deleted');
        await queryRunner.dropColumn('organization', 'deletedAt');

        // Remove from LoginProvider
        await queryRunner.dropColumn('login_provider', 'deleted');
        await queryRunner.dropColumn('login_provider', 'deletedAt');

        // Remove from LoginCredential
        await queryRunner.dropColumn('login_credential', 'deleted');
        await queryRunner.dropColumn('login_credential', 'deletedAt');

        // Remove from BaseUser
        await queryRunner.dropColumn('base_user', 'deleted');
        await queryRunner.dropColumn('base_user', 'deletedAt');
    }
} 
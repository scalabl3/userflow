import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { getManyToOneRelation } from './helpers';

/**
 * Adds foreign key relationship between User and Organization.
 * 
 * Relationship:
 * - Many Users belong to one Organization (M:1)
 * - Required relationship (not nullable)
 * - SET NULL on delete (users become unaffiliated)
 * 
 * This is added separately from CREATE to ensure proper table order
 * and to maintain clear relationship dependencies.
 * 
 * Note: This differs from the Organization's adminUser relationship,
 * which is One-to-One and uses RESTRICT on delete.
 */
export class Add_User_Fk_Organization_1737964200_011200 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Get relationship configuration
        const orgRelation = getManyToOneRelation(
            'organizationId',
            'organization',
            true,  // required
            'SET NULL'  // users become unaffiliated if org is deleted
        );

        await queryRunner.createForeignKey(
            'user',
            new TableForeignKey(orgRelation.constraint)
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('user');
        const foreignKey = table?.foreignKeys.find(fk => 
            fk.columnNames.indexOf('organizationId') !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey('user', foreignKey);
        }
    }
} 
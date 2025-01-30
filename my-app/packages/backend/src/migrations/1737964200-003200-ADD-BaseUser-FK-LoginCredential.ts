import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';
import { getManyToOneRelation } from './helpers';

/**
 * Adds foreign key relationship between LoginCredential and BaseUser.
 * 
 * Relationship:
 * - Many LoginCredentials belong to one BaseUser (M:1)
 * - Required relationship (not nullable)
 * - CASCADE on delete (credentials deleted with user)
 * 
 * This is added separately from CREATE to ensure proper table order
 * and to maintain clear relationship dependencies.
 */
export class Add_BaseUser_Fk_LoginCredential_1737964200_003200 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Get relationship configuration
        const userRelation = getManyToOneRelation(
            'baseUserId',
            'base_user',
            true,  // required
            'CASCADE'  // delete credentials if user is deleted
        );

        await queryRunner.createForeignKey(
            'login_credential',
            new TableForeignKey(userRelation.constraint)
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('login_credential');
        const foreignKey = table?.foreignKeys.find(fk => 
            fk.columnNames.indexOf('baseUserId') !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey('login_credential', foreignKey);
        }
    }
} 
import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddBaseUserFkLoginCredential1737964200005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'base_user',
            new TableForeignKey({
                columnNames: ['primaryLoginCredentialId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'login_credential',
                onDelete: 'SET NULL',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('base_user');
        if (table) {
            const foreignKey = table.foreignKeys.find(
                fk => fk.columnNames.indexOf('primaryLoginCredentialId') !== -1
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey('base_user', foreignKey);
            }
        }
    }
} 
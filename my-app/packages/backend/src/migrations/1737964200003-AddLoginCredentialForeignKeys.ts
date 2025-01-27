import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddLoginCredentialForeignKeys1737964200003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'login_credential',
            new TableForeignKey({
                columnNames: ['loginProviderId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'login_provider',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('login_credential');
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('loginProviderId') !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey('login_credential', foreignKey);
            }
        }
    }
} 
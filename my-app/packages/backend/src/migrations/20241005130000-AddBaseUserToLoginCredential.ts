import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddBaseUserToLoginCredential20241005130000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'login_credential',
            new TableColumn({
                name: 'baseUserId',
                type: 'uuid',
                isNullable: true,
            })
        );

        await queryRunner.createForeignKey(
            'login_credential',
            new TableForeignKey({
                columnNames: ['baseUserId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'base_user',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('login_credential');
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('baseUserId') !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey('login_credential', foreignKey);
            }
            await queryRunner.dropColumn('login_credential', 'baseUserId');
        }
    }
} 
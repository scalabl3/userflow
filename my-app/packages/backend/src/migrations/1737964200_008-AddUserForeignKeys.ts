import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddUserForeignKeys1737964200008 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'user',
            new TableForeignKey({
                columnNames: ['organizationId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'organization',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('user');
        if (table) {
            const foreignKey = table.foreignKeys.find(
                fk => fk.columnNames.indexOf('organizationId') !== -1
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey('user', foreignKey);
            }
        }
    }
} 
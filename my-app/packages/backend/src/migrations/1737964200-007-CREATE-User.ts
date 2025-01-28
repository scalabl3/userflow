import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { getIdColumn, getTimestampColumns } from './helpers';

export class CreateUser1737964200007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'username',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'displayname',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'organizationId',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'preferences',
                        type: 'simple-json',
                        isNullable: true,
                    },
                    ...getTimestampColumns(queryRunner)
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }
}

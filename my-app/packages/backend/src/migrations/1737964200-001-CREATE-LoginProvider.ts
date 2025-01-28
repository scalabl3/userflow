import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { getIdColumn, getTimestampColumns } from './helpers';

export class CreateLoginProvider1737964200001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'login_provider',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'code',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    ...getTimestampColumns(queryRunner)
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('login_provider');
    }
} 
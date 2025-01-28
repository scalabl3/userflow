import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { getIdColumn, getTimestampColumns } from './helpers';

export class CreateOrganization1737964200006 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
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
                        default: `'shadow'`,
                    },
                    {
                        name: 'visible',
                        type: 'boolean',
                        isNullable: false,
                        default: false,
                    },
                    {
                        name: 'adminUser',
                        type: 'uuid',
                        isNullable: false,
                    },
                    ...getTimestampColumns(queryRunner)
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('organization');
    }
}

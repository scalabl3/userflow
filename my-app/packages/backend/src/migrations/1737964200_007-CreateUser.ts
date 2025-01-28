import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser_1737964200_007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
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
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }
}

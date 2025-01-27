import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLoginCredential20241004154000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'login_credential',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'passwordHash',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'isActive',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'modifiedAt',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('login_credential');
    }
}

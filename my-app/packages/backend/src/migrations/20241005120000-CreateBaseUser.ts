import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBaseUser20241005120000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'base_user',
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
                        name: 'firstname',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'lastname',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'displayname',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'contactEmail',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'state',
                        type: 'varchar',
                        enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED'],
                        default: `'PENDING'`,
                        isNullable: false,
                    },
                    {
                        name: 'primaryLoginCredentialId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'lastLoginAt',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'isEnabled',
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
        const foreignKey = table!.foreignKeys.find(
            fk => fk.columnNames.indexOf('primaryLoginCredentialId') !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey('base_user', foreignKey);
        }
        await queryRunner.dropTable('base_user');
    }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
                        name: 'identifier',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'loginProviderId',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'credentials',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'credentialType',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'expiresAt',
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
                uniques: [
                    {
                        columnNames: ['identifier', 'loginProviderId']
                    }
                ]
            }),
            true
        );

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
        await queryRunner.dropTable('login_credential');
    }
}

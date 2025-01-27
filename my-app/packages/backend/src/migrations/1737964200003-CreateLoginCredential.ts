import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { CredentialType, OAuthProvider } from '@my-app/shared';

export class CreateLoginCredential1737964200003 implements MigrationInterface {
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
                        name: 'credentialType',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    // Password-specific fields
                    {
                        name: 'passwordHash',
                        type: 'varchar',
                        isNullable: true,
                    },
                    // OAuth-specific fields
                    {
                        name: 'provider',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'accessToken',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'accessTokenExpiresAt',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'refreshToken',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'refreshTokenExpiresAt',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'scope',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'rawProfile',
                        type: 'json',
                        isNullable: true,
                    },
                    // Apple-specific fields
                    {
                        name: 'identityToken',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'authorizationCode',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'realUserStatus',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'nonce',
                        type: 'varchar',
                        isNullable: true,
                    },
                    // Timestamps
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
                ],
                indices: [
                    {
                        columnNames: ['loginProviderId']
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

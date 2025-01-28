import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { CredentialType, OAuthProvider } from '@my-app/shared';
import { getIdColumn, getTimestampColumns, getEnumColumn, createEnumCheck, dropEnumCheck } from './helpers';

export class CreateLoginCredential1737964200002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'login_credential',
                columns: [
                    getIdColumn(queryRunner),
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
                    getEnumColumn(queryRunner, 'credentialType', Object.values(CredentialType), false),
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
                    getEnumColumn(queryRunner, 'provider', Object.values(OAuthProvider), true),
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
                    ...getTimestampColumns(queryRunner)
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

        await createEnumCheck(queryRunner, 'login_credential', 'credentialType', Object.values(CredentialType));
        await createEnumCheck(queryRunner, 'login_credential', 'provider', Object.values(OAuthProvider));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await dropEnumCheck(queryRunner, 'login_credential', 'provider');
        await dropEnumCheck(queryRunner, 'login_credential', 'credentialType');
        await queryRunner.dropTable('login_credential');
    }
}

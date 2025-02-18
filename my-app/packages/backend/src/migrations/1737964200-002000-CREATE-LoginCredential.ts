import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { CredentialType } from '../managers/AuthenticationManager';
import { FieldLengths } from '@my-app/shared';

/**
 * Creates the login_credential table with standardized columns and relationships.
 * 
 * Core Fields:
 * - UUID primary key
 * - Identifier (username/email/phone)
 * - Credential type (password/oauth) with named enum
 * - Enabled flag for credential activation
 * 
 * Relationships:
 * - Many-to-One with LoginProvider (RESTRICT delete)
 *   - Prevents orphaned credentials
 *   - Required relationship
 * - Many-to-One with BaseUser (CASCADE delete)
 *   - Credentials deleted with user
 *   - Required relationship
 * 
 * Type-specific Fields:
 * - Password Authentication:
 *   - Password hash (nullable)
 * 
 * - OAuth Authentication:
 *   - Provider type (named enum)
 *   - Access token with expiry
 *   - Refresh token with expiry
 *   - Profile data as structured JSON
 * 
 * - Apple-specific OAuth:
 *   - Identity token
 *   - Authorization code
 *   - Real user status
 *   - Nonce for security
 * 
 * Indices:
 * - Unique composite: (identifier, provider) for login uniqueness
 * - Foreign keys: provider and user for relationship queries
 */
export class CreateLoginCredential1737964200002000 implements MigrationInterface {
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
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'identifier',
                        type: 'varchar',
                        length: String(FieldLengths.IDENTIFIER.MAX),
                        isNullable: false
                    },
                    {
                        name: 'credential_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        enum: Object.values(CredentialType)
                    },
                    {
                        name: 'provider_code',
                        type: 'varchar',
                        length: String(FieldLengths.CODE.MAX),
                        isNullable: false
                    },
                    {
                        name: 'is_enabled',
                        type: 'boolean',
                        default: true
                    },
                    {
                        name: 'deleted',
                        type: 'boolean',
                        default: false
                    },
                    {
                        name: 'password_hash',
                        type: 'varchar',
                        length: String(FieldLengths.PASSWORD_HASH.MAX),
                        isNullable: true
                    },
                    {
                        name: 'access_token',
                        type: 'varchar',
                        length: String(FieldLengths.TOKEN.MAX),
                        isNullable: true
                    },
                    {
                        name: 'refresh_token',
                        type: 'varchar',
                        length: String(FieldLengths.TOKEN.MAX),
                        isNullable: true
                    },
                    {
                        name: 'access_token_expires_at',
                        type: 'datetime',
                        isNullable: true
                    },
                    {
                        name: 'refresh_token_expires_at',
                        type: 'datetime',
                        isNullable: true
                    },
                    {
                        name: 'base_user_id',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'modified_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'deleted_at',
                        type: 'datetime',
                        isNullable: true
                    }
                ],
                indices: [
                    {
                        name: 'IDX_LOGIN_CRED_IDENTIFIER',
                        columnNames: ['identifier', 'provider_code'],
                        isUnique: true
                    },
                    {
                        name: 'IDX_LOGIN_CRED_USER',
                        columnNames: ['base_user_id']
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            'login_credential',
            new TableForeignKey({
                name: 'FK_LOGIN_CRED_USER',
                columnNames: ['base_user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'base_user',
                onDelete: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('login_credential', true);
    }
}

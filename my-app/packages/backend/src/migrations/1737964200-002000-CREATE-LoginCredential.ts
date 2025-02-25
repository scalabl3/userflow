import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { CredentialType } from '../managers/AuthenticationManager';
import { FieldLengths } from '@my-app/shared';

/**
 * Creates the login_credential table with standardized columns and relationships.
 * 
 * Table Structure:
 * ================
 * 
 * Core Fields
 * -----------
 * | Column          | Type      | Description                    |
 * |-----------------|-----------|--------------------------------|
 * | id              | uuid      | Primary key                    |
 * | identifier      | varchar   | User identifier (email/phone)  |
 * | credential_type | enum      | Authentication method type     |
 * | is_enabled      | boolean   | Activation status             |
 * | deleted         | boolean   | Soft deletion flag            |
 * 
 * Password Authentication
 * ----------------------
 * | Column          | Type      | Description                    |
 * |-----------------|-----------|--------------------------------|
 * | password_hash   | varchar   | Hashed password storage        |
 * 
 * OAuth Authentication
 * -------------------
 * | Column                    | Type      | Description                    |
 * |---------------------------|-----------|--------------------------------|
 * | access_token             | varchar   | OAuth access token             |
 * | refresh_token            | varchar   | OAuth refresh token            |
 * | access_token_expires_at  | datetime  | Access token expiration        |
 * | refresh_token_expires_at | datetime  | Refresh token expiration       |
 * 
 * Apple Sign In
 * -------------
 * | Column             | Type      | Description                    |
 * |--------------------|-----------|--------------------------------|
 * | identity_token     | varchar   | Apple JWT identity token       |
 * | authorization_code | varchar   | Apple authorization code       |
 * | real_user_status   | varchar   | Apple's user validation status |
 * | nonce              | varchar   | Security nonce for validation  |
 * 
 * Relationships
 * ------------
 * | Column        | Type      | Description                    |
 * |---------------|-----------|--------------------------------|
 * | base_user_id  | uuid      | Foreign key to base_user       |
 * 
 * Timestamps
 * ----------
 * | Column      | Type      | Description                    |
 * |-------------|-----------|--------------------------------|
 * | created_at  | datetime  | Creation timestamp             |
 * | modified_at | datetime  | Last modification timestamp    |
 * | deleted_at  | datetime  | Soft deletion timestamp        |
 * 
 * Indices
 * -------
 * 1. IDX_LOGIN_CRED_IDENTIFIER (identifier, credential_type) UNIQUE
 *    - Ensures unique login credentials per type
 * 2. IDX_LOGIN_CRED_USER (base_user_id)
 *    - Optimizes user credential lookups
 * 
 * Foreign Keys
 * ------------
 * 1. FK_LOGIN_CRED_USER
 *    - References: base_user(id)
 *    - On Delete: CASCADE
 *    - Ensures credential cleanup with user deletion
 */
export class CreateLoginCredential1737964200002000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'login_credential',
                columns: [
                    // Core Fields
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
                        name: 'is_enabled',
                        type: 'boolean',
                        default: true
                    },
                    {
                        name: 'deleted',
                        type: 'boolean',
                        default: false
                    },

                    // Password Authentication Fields
                    {
                        name: 'password_hash',
                        type: 'varchar',
                        length: String(FieldLengths.PASSWORD_HASH.MAX),
                        isNullable: true
                    },

                    // OAuth Authentication Fields
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

                    // Apple Sign In Fields
                    {
                        name: 'identity_token',
                        type: 'varchar',
                        length: String(FieldLengths.TOKEN.MAX),
                        isNullable: true
                    },
                    {
                        name: 'authorization_code',
                        type: 'varchar',
                        length: String(FieldLengths.AUTH_CODE.MAX),
                        isNullable: true
                    },
                    {
                        name: 'real_user_status',
                        type: 'varchar',
                        length: String(FieldLengths.REAL_USER_STATUS.MAX),
                        isNullable: true
                    },
                    {
                        name: 'nonce',
                        type: 'varchar',
                        length: String(FieldLengths.NONCE.MAX),
                        isNullable: true
                    },

                    // Relationship Fields
                    {
                        name: 'base_user_id',
                        type: 'uuid',
                        isNullable: false
                    },

                    // Timestamp Fields
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
                        columnNames: ['identifier', 'credential_type'],
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

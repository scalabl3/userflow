import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import { CredentialType, OAuthProvider } from '@my-app/shared';
import { 
    getIdColumn, 
    getTimestampColumns, 
    getEnumColumn, 
    getJsonColumn,
    getManyToOneRelation
} from './helpers';

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
export class Create_LoginCredential_1737964200_002000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Get relationship configurations using helpers
        const providerRelation = getManyToOneRelation(
            'loginProviderId',
            'login_provider',
            true,  // required
            'RESTRICT'  // prevent provider deletion if credentials exist
        );

        const userRelation = getManyToOneRelation(
            'baseUserId',
            'base_user',
            true,  // required
            'CASCADE'  // delete credentials if user is deleted
        );

        await queryRunner.createTable(
            new Table({
                name: 'login_credential',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'identifier',
                        type: 'varchar',
                        length: '255',  // Standardized length for identifiers
                        isNullable: false,
                    },
                    // Relationship columns using helpers
                    new TableColumn(providerRelation.column),
                    new TableColumn(userRelation.column),
                    // Core fields with named enums
                    getEnumColumn('credentialType', Object.values(CredentialType), false),
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
                        length: '255',  // Standard length for hashes
                        isNullable: true,
                    },
                    // OAuth-specific fields with named enum
                    getEnumColumn('provider', Object.values(OAuthProvider), true),
                    {
                        name: 'accessToken',
                        type: 'varchar',
                        length: '2048',  // Long enough for JWT tokens
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
                        length: '2048',  // Long enough for refresh tokens
                        isNullable: true,
                    },
                    {
                        name: 'refreshTokenExpiresAt',
                        type: 'datetime',
                        isNullable: true,
                    },
                    // OAuth profile as structured JSON
                    new TableColumn(
                        getJsonColumn(queryRunner, 'profile', true, {
                            scope: '',
                            rawData: {}
                        })
                    ),
                    // Apple-specific fields
                    {
                        name: 'identityToken',
                        type: 'varchar',
                        length: '2048',  // Long enough for JWT tokens
                        isNullable: true,
                    },
                    {
                        name: 'authorizationCode',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'realUserStatus',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'nonce',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    ...getTimestampColumns(queryRunner)
                ],
                indices: [
                    {
                        name: 'IDX_LOGIN_CREDENTIAL_IDENTIFIER_PROVIDER',
                        columnNames: ['identifier', 'loginProviderId'],
                        isUnique: true
                    },
                    {
                        name: 'IDX_LOGIN_CREDENTIAL_PROVIDER',
                        columnNames: ['loginProviderId']
                    },
                    {
                        name: 'IDX_LOGIN_CREDENTIAL_USER',
                        columnNames: ['baseUserId']
                    }
                ],
                foreignKeys: [
                    new TableForeignKey(providerRelation.constraint),
                    new TableForeignKey(userRelation.constraint)
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('login_credential');
    }
}

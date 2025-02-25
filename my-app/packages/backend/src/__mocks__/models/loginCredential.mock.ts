/**
 * LoginCredential mock data for testing authentication credentials.
 * 
 * Core Features:
 * - Mock credential instances (PASSWORD, OAUTH_*, etc.)
 * - Credential creation method
 * - DTOs for API operations
 * 
 * Structure:
 * - instances: Credential instances by type
 * - lists: Collections for testing
 * - DTOs: Create, Response
 * 
 * Relationships:
 * - Belongs to BaseUser (M:1)
 */

import { LoginCredential } from '@my-app/backend/src/models/LoginCredential';
import { CredentialType } from '@my-app/backend/src/managers/AuthenticationManager';
import { core } from './core.mock';
import { baseUser } from './baseUser.mock';

/**
 * Create a mock LoginCredential instance.
 */
const createLoginCredential = (
    id: string,
    identifier: string,
    credentialType: CredentialType,
    baseUserId: string,
    overrides: Partial<LoginCredential> = {}
): LoginCredential => {
    const credential = new LoginCredential();
    credential.id = id;
    credential.identifier = identifier;
    credential.credentialType = credentialType;
    credential.baseUserId = baseUserId;
    credential.isEnabled = true;
    credential.deleted = false;
    credential.createdAt = core.timestamps.past;
    credential.modifiedAt = core.timestamps.now;

    return Object.assign(credential, overrides);
};

/**
 * Mock credential instances for different test scenarios
 */
const instances = {
    password: {
        standard: createLoginCredential(
            core.ids.passwordCred,
            core.constants.email,
            CredentialType.PASSWORD,
            core.ids.baseUser,
            { passwordHash: 'hashed_password' }
        )
    },
    oauth: {
        google: createLoginCredential(
            core.ids.googleCred,
            'google-user-id',
            CredentialType.OAUTH_GOOGLE,
            core.ids.baseUser2,
            {
                accessToken: core.constants.oauthToken,
                accessTokenExpiresAt: core.timestamps.future,
                refreshToken: core.constants.oauthRefresh,
                refreshTokenExpiresAt: core.timestamps.future
            }
        ),
        github: createLoginCredential(
            'github-cred-123',
            'github-user-id',
            CredentialType.OAUTH_GITHUB,
            core.ids.baseUser2,
            {
                accessToken: core.constants.oauthToken,
                accessTokenExpiresAt: core.timestamps.future
            }
        ),
        apple: createLoginCredential(
            'apple-cred-123',
            'apple-user-id',
            CredentialType.OAUTH_APPLE,
            core.ids.baseUser3,
            {
                accessToken: core.constants.oauthToken,
                accessTokenExpiresAt: core.timestamps.future,
                refreshToken: core.constants.oauthRefresh,
                refreshTokenExpiresAt: core.timestamps.future
            }
        )
    }
};

/**
 * Mock credential lists for testing collection operations
 */
const lists = {
    empty: [],
    single: [instances.password.standard],
    multiple: [
        instances.password.standard,
        instances.oauth.google,
        instances.oauth.github
    ],
    byType: {
        password: [instances.password.standard],
        oauth: [
            instances.oauth.google,
            instances.oauth.github,
            instances.oauth.apple
        ]
    },
    byUser: {
        [core.ids.baseUser]: [instances.password.standard],
        [core.ids.baseUser2]: [
            instances.oauth.google,
            instances.oauth.github
        ],
        [core.ids.baseUser3]: [instances.oauth.apple]
    }
};

/**
 * Mock credential DTOs for testing API operations
 */
const dtos = {
    create: {
        password: {
            identifier: core.constants.email,
            credentialType: CredentialType.PASSWORD,
            baseUserId: core.ids.baseUser,
            password: core.constants.password
        },
        oauth: {
            google: {
                identifier: 'google-user-id',
                credentialType: CredentialType.OAUTH_GOOGLE,
                baseUserId: core.ids.baseUser2,
                accessToken: core.constants.oauthToken,
                accessTokenExpiresAt: core.timestamps.future,
                refreshToken: core.constants.oauthRefresh,
                refreshTokenExpiresAt: core.timestamps.future
            },
            github: {
                identifier: 'github-user-id',
                credentialType: CredentialType.OAUTH_GITHUB,
                baseUserId: core.ids.baseUser2,
                accessToken: core.constants.oauthToken,
                accessTokenExpiresAt: core.timestamps.future
            },
            apple: {
                identifier: 'apple-user-id',
                credentialType: CredentialType.OAUTH_APPLE,
                baseUserId: core.ids.baseUser3,
                accessToken: core.constants.oauthToken,
                accessTokenExpiresAt: core.timestamps.future,
                refreshToken: core.constants.oauthRefresh,
                refreshTokenExpiresAt: core.timestamps.future
            }
        }
    },
    response: {
        password: {
            id: core.ids.passwordCred,
            identifier: core.constants.email,
            credentialType: CredentialType.PASSWORD,
            baseUserId: core.ids.baseUser,
            isEnabled: true,
            createdAt: core.timestamps.past,
            modifiedAt: core.timestamps.now
        },
        oauth: {
            google: {
                id: core.ids.googleCred,
                identifier: 'google-user-id',
                credentialType: CredentialType.OAUTH_GOOGLE,
                baseUserId: core.ids.baseUser2,
                isEnabled: true,
                createdAt: core.timestamps.past,
                modifiedAt: core.timestamps.now
            }
        }
    }
};

/**
 * LoginCredential mock data export
 */
export const loginCredential = {
    instances,
    lists,
    dtos,
    createLoginCredential
}; 
import { validate } from 'class-validator';
import { LoginCredential } from './LoginCredential';
import { CredentialType, OAuthProvider } from '@my-app/shared/dist/enums/CredentialType';

describe('LoginCredential', () => {
    let credential: LoginCredential;

    beforeEach(() => {
        credential = new LoginCredential();
    });

    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(credential).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(credential.isEnabled).toBe(true);
            expect(credential.profile).toBeUndefined();
        });

        it('should handle id field', () => {
            const credentialId = '123e4567-e89b-12d3-a456-426614174000';
            credential.id = credentialId;
            expect(credential.id).toBe(credentialId);
        });
    });

    describe('properties', () => {
        describe('core properties', () => {
            it('should get and set identifier', () => {
                const identifier = 'test@example.com';
                credential.identifier = identifier;
                expect(credential.identifier).toBe(identifier);
            });

            it('should get and set credential type', () => {
                credential.credentialType = CredentialType.PASSWORD;
                expect(credential.credentialType).toBe(CredentialType.PASSWORD);

                credential.credentialType = CredentialType.OAUTH;
                expect(credential.credentialType).toBe(CredentialType.OAUTH);
            });

            it('should get and set enabled status', () => {
                credential.isEnabled = false;
                expect(credential.isEnabled).toBe(false);

                credential.isEnabled = true;
                expect(credential.isEnabled).toBe(true);
            });
        });

        describe('password authentication', () => {
            beforeEach(() => {
                credential.credentialType = CredentialType.PASSWORD;
            });

            it('should get and set password hash', () => {
                const hash = 'hashed_password_123';
                credential.passwordHash = hash;
                expect(credential.passwordHash).toBe(hash);
            });
        });

        describe('oauth authentication', () => {
            beforeEach(() => {
                credential.credentialType = CredentialType.OAUTH;
                credential.provider = OAuthProvider.GOOGLE;
            });

            it('should get and set provider type', () => {
                expect(credential.provider).toBe(OAuthProvider.GOOGLE);
                
                credential.provider = OAuthProvider.APPLE;
                expect(credential.provider).toBe(OAuthProvider.APPLE);
            });

            it('should get and set access token', () => {
                const token = 'access_token_123';
                credential.accessToken = token;
                expect(credential.accessToken).toBe(token);
            });

            it('should get and set token expiration', () => {
                const expiry = new Date();
                credential.accessTokenExpiresAt = expiry;
                expect(credential.accessTokenExpiresAt).toBe(expiry);
            });

            it('should get and set refresh token', () => {
                const token = 'refresh_token_123';
                credential.refreshToken = token;
                expect(credential.refreshToken).toBe(token);
            });

            it('should get and set profile data', () => {
                const profile = {
                    scope: 'email profile',
                    rawData: { email: 'test@example.com' }
                };
                credential.profile = profile;
                expect(credential.profile).toEqual(profile);
            });
        });

        describe('apple authentication', () => {
            beforeEach(() => {
                credential.credentialType = CredentialType.OAUTH;
                credential.provider = OAuthProvider.APPLE;
            });

            it('should get and set identity token', () => {
                const token = 'identity_token_123';
                credential.identityToken = token;
                expect(credential.identityToken).toBe(token);
            });

            it('should get and set authorization code', () => {
                const code = 'auth_code_123';
                credential.authorizationCode = code;
                expect(credential.authorizationCode).toBe(code);
            });

            it('should get and set real user status', () => {
                const status = 'REAL';
                credential.realUserStatus = status;
                expect(credential.realUserStatus).toBe(status);
            });

            it('should get and set nonce', () => {
                const nonce = 'nonce_123';
                credential.nonce = nonce;
                expect(credential.nonce).toBe(nonce);
            });
        });
    });

    describe('relationships', () => {
        describe('loginProvider relationship', () => {
            describe('foreign key', () => {
                it('should get and set loginProviderId', () => {
                    const id = '123e4567-e89b-12d3-a456-426614174000';
                    credential.loginProviderId = id;
                    expect(credential.loginProviderId).toBe(id);
                });

                it('should require loginProviderId', async () => {
                    expect(credential.loginProviderId).toBeUndefined();
                    const errors = await validate(credential);
                    const providerIdErrors = errors.find(e => e.property === 'loginProviderId');
                    expect(providerIdErrors?.constraints).toHaveProperty('isUuid');
                });
            });
        });

        describe('baseUser relationship', () => {
            describe('foreign key', () => {
                it('should get and set baseUserId', () => {
                    const id = '123e4567-e89b-12d3-a456-426614174000';
                    credential.baseUserId = id;
                    expect(credential.baseUserId).toBe(id);
                });

                it('should require baseUserId', async () => {
                    expect(credential.baseUserId).toBeUndefined();
                    const errors = await validate(credential);
                    const userIdErrors = errors.find(e => e.property === 'baseUserId');
                    expect(userIdErrors?.constraints).toHaveProperty('isUuid');
                });
            });
        });
    });

    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const now = new Date();
            credential.createdAt = now;
            credential.modifiedAt = now;

            expect(credential.createdAt).toBe(now);
            expect(credential.modifiedAt).toBe(now);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(credential.deleted).toBe(false);
            expect(credential.deletedAt).toBeUndefined();
            
            // Mark as deleted
            const deletionTime = new Date();
            credential.deleted = true;
            credential.deletedAt = deletionTime;
            
            expect(credential.deleted).toBe(true);
            expect(credential.deletedAt).toBe(deletionTime);
        });
    });
}); 
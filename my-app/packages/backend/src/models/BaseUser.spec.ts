import { validate } from 'class-validator';
import { BaseUser } from './BaseUser';
import { UserState } from '@my-app/shared/dist/enums/UserState';

describe('BaseUser', () => {
    let user: BaseUser;

    beforeEach(() => {
        user = new BaseUser();
    });

    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(user).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(user.state).toBe(UserState.PENDING);
            expect(user.isEnabled).toBe(true);
            expect(user.lastLoginAt).toBeUndefined();
        });

        it('should handle id field', () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';
            user.id = userId;
            expect(user.id).toBe(userId);
        });
    });

    describe('properties', () => {
        describe('core properties', () => {
            it('should get and set firstname', () => {
                const firstname = 'John';
                user.firstname = firstname;
                expect(user.firstname).toBe(firstname);
            });

            it('should require firstname', async () => {
                expect(user.firstname).toBeUndefined();
                const errors = await validate(user);
                const firstnameErrors = errors.find(e => e.property === 'firstname');
                expect(firstnameErrors?.constraints).toHaveProperty('isString');
            });

            it('should get and set lastname', () => {
                const lastname = 'Doe';
                user.lastname = lastname;
                expect(user.lastname).toBe(lastname);
            });

            it('should require lastname', async () => {
                expect(user.lastname).toBeUndefined();
                const errors = await validate(user);
                const lastnameErrors = errors.find(e => e.property === 'lastname');
                expect(lastnameErrors?.constraints).toHaveProperty('isString');
            });

            it('should get and set contact email', () => {
                const email = 'john@example.com';
                user.contactEmail = email;
                expect(user.contactEmail).toBe(email);
            });

            it('should require contact email', async () => {
                expect(user.contactEmail).toBeUndefined();
                const errors = await validate(user);
                const emailErrors = errors.find(e => e.property === 'contactEmail');
                expect(emailErrors?.constraints).toHaveProperty('isEmail');
            });
        });

        describe('state management', () => {
            it('should handle state transitions', () => {
                const states = [
                    UserState.PENDING,
                    UserState.ACTIVE,
                    UserState.SUSPENDED,
                    UserState.DEACTIVATED
                ];

                states.forEach(state => {
                    user.state = state;
                    expect(user.state).toBe(state);
                });
            });

            it('should handle enabled flag', () => {
                user.isEnabled = false;
                expect(user.isEnabled).toBe(false);

                user.isEnabled = true;
                expect(user.isEnabled).toBe(true);
            });

            it('should handle last login time', () => {
                const loginTime = new Date();
                user.lastLoginAt = loginTime;
                expect(user.lastLoginAt).toBe(loginTime);
            });
        });
    });

    describe('relationships', () => {
        describe('loginCredentials collection', () => {
            it('should initialize loginCredentials as empty array', () => {
                expect(user.loginCredentials).toBeDefined();
                expect(Array.isArray(user.loginCredentials)).toBe(true);
                expect(user.loginCredentials).toHaveLength(0);
            });
        });
    });

    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const now = new Date();
            user.createdAt = now;
            user.modifiedAt = now;

            expect(user.createdAt).toBe(now);
            expect(user.modifiedAt).toBe(now);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(user.deleted).toBe(false);
            expect(user.deletedAt).toBeUndefined();
            
            // Mark as deleted
            const deletionTime = new Date();
            user.deleted = true;
            user.deletedAt = deletionTime;
            
            expect(user.deleted).toBe(true);
            expect(user.deletedAt).toBe(deletionTime);
        });
    });
}); 
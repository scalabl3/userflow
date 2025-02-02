import { validate } from 'class-validator';
import { User, NotificationPreferences } from './User';
import { UserState } from '@my-app/shared';

describe('User', () => {
    let user: User;

    beforeEach(() => {
        user = new User();
    });

    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(user).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(user.state).toBe(UserState.PENDING);
            expect(user.isEnabled).toBe(true);
            expect(user.preferences).toBeDefined();
            expect(user.preferences.theme).toBe('light');
            expect(user.preferences.notifications.email).toBe(true);
            expect(user.preferences.notifications.push).toBe(true);
        });

        it('should handle id field', () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';
            user.id = userId;
            expect(user.id).toBe(userId);
        });
    });

    describe('properties', () => {
        describe('core properties', () => {
            it('should get and set username', () => {
                const username = 'johndoe';
                user.username = username;
                expect(user.username).toBe(username);
            });

            it('should get and set displayname', () => {
                const displayname = 'John Doe';
                user.displayname = displayname;
                expect(user.displayname).toBe(displayname);
            });
        });

        describe('inherited properties', () => {
            it('should handle firstname from BaseUser', () => {
                const firstname = 'John';
                user.firstname = firstname;
                expect(user.firstname).toBe(firstname);
            });

            it('should handle lastname from BaseUser', () => {
                const lastname = 'Doe';
                user.lastname = lastname;
                expect(user.lastname).toBe(lastname);
            });

            it('should handle state from BaseUser', () => {
                user.state = UserState.ACTIVE;
                expect(user.state).toBe(UserState.ACTIVE);
            });
        });

        describe('preferences', () => {
            it('should get and set theme', () => {
                user.preferences.theme = 'dark';
                expect(user.preferences.theme).toBe('dark');

                user.preferences.theme = 'light';
                expect(user.preferences.theme).toBe('light');
            });

            it('should get and set notification preferences', () => {
                user.preferences.notifications.email = false;
                expect(user.preferences.notifications.email).toBe(false);

                user.preferences.notifications.push = false;
                expect(user.preferences.notifications.push).toBe(false);
            });

            it('should handle complete preference override', () => {
                const newPrefs = {
                    theme: 'dark' as const,
                    notifications: {
                        email: false,
                        push: true
                    }
                };
                user.preferences = newPrefs;
                expect(user.preferences).toEqual(newPrefs);
            });
        });
    });

    describe('relationships', () => {
        describe('organization relationship', () => {
            describe('foreign key', () => {
                it('should get and set organizationId', () => {
                    const id = '123e4567-e89b-12d3-a456-426614174000';
                    user.organizationId = id;
                    expect(user.organizationId).toBe(id);
                });

                it('should require organizationId', async () => {
                    expect(user.organizationId).toBeUndefined();
                    const errors = await validate(user);
                    const orgIdErrors = errors.find(e => e.property === 'organizationId');
                    expect(orgIdErrors?.constraints).toHaveProperty('isUuid');
                });
            });
        });

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

        it('should track last login time from BaseUser', () => {
            const loginTime = new Date();
            user.lastLoginAt = loginTime;
            expect(user.lastLoginAt).toBe(loginTime);
        });
    });
}); 

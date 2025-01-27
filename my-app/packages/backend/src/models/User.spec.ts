import { User } from './User';
import { Organization } from './Organization';
import { UserState } from '@my-app/shared/dist/enums/UserState';

describe('User', () => {
    let user: User;
    let organization: Organization;

    beforeEach(() => {
        organization = new Organization();
        organization.id = 'org123';
        organization.name = 'Test Org';
        organization.adminUser = 'admin123';
        organization.visible = true;

        user = new User();
        user.id = 'user123';
        user.firstname = 'John';
        user.lastname = 'Doe';
        user.displayname = 'John Doe';
        user.contactEmail = 'john@example.com';
        user.organizationId = organization.id;
        user.state = UserState.ACTIVE;
        user.preferences = {
            theme: 'light',
            notifications: {
                email: true,
                push: true
            }
        };
    });

    it('should create an instance', () => {
        expect(user).toBeTruthy();
    });

    it('should set basic properties', () => {
        expect(user.id).toBe('user123');
        expect(user.firstname).toBe('John');
        expect(user.lastname).toBe('Doe');
        expect(user.displayname).toBe('John Doe');
        expect(user.contactEmail).toBe('john@example.com');
        expect(user.organizationId).toBe(organization.id);
        expect(user.state).toBe(UserState.ACTIVE);
    });

    it('should inherit from BaseUser', () => {
        expect(user.id).toBeDefined();
        expect(user.firstname).toBeDefined();
        expect(user.lastname).toBeDefined();
        expect(user.displayname).toBeDefined();
        expect(user.contactEmail).toBeDefined();
        expect(user.state).toBeDefined();
        expect(user.createdAt).toBeDefined();
        expect(user.modifiedAt).toBeDefined();
    });

    it('should have organization reference', () => {
        expect(user.organizationId).toBeDefined();
        expect(user.organizationId).toBe(organization.id);
    });

    describe('preferences', () => {
        it('should set default preferences on BeforeInsert when preferences is undefined', () => {
            user.preferences = null as any;
            user.setDefaultPreferences();
            
            expect(user.preferences).toEqual({
                theme: 'light',
                notifications: {
                    email: true,
                    push: true
                }
            });
        });

        it('should not override existing preferences on BeforeInsert', () => {
            const customPreferences = {
                theme: 'dark' as const,
                notifications: {
                    email: false,
                    push: true
                }
            };
            user.preferences = customPreferences;
            user.setDefaultPreferences();
            
            expect(user.preferences).toEqual(customPreferences);
        });

        it('should allow partial preferences update', () => {
            user.preferences = {
                theme: 'dark'
            };
            expect(user.preferences.theme).toBe('dark');
            expect(user.preferences.notifications).toBeUndefined();
        });
    });
}); 

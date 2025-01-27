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
        organization.visible = true;
        organization.adminUser = 'admin123';
        organization.createdAt = new Date();
        organization.modifiedAt = new Date();

        user = new User();
        user.id = 'user123';
        user.firstname = 'John';
        user.lastname = 'Doe';
        user.displayname = 'John Doe';
        user.contactEmail = 'john.doe@example.com';
        user.state = UserState.ACTIVE;
        user.organization = organization;
        user.organizationId = organization.id;
        user.createdAt = new Date();
        user.modifiedAt = new Date();
    });

    it('should create a user instance', () => {
        expect(user).toBeDefined();
        expect(user).toBeInstanceOf(User);
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

    it('should have organization relationship', () => {
        expect(user.organization).toBeDefined();
        expect(user.organization).toBe(organization);
        expect(user.organizationId).toBe(organization.id);
    });

    it('should allow null profileId', () => {
        expect(user.profileId).toBeUndefined();
        user.profileId = 'profile123';
        expect(user.profileId).toBe('profile123');
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

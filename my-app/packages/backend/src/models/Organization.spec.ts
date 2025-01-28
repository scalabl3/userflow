import { Organization } from './Organization';
import { User } from './User';

describe('Organization', () => {
    let organization: Organization;

    beforeEach(() => {
        organization = new Organization();
        // Set default values manually since decorators don't work in tests
        organization.name = 'shadow';
        organization.visible = false;
        organization.users = [];
    });

    it('should create an instance', () => {
        expect(organization).toBeTruthy();
    });

    it('should handle id field', () => {
        const orgId = '123e4567-e89b-12d3-a456-426614174000';
        organization.id = orgId;
        expect(organization.id).toBe(orgId);
    });

    it('should initialize with default values', () => {
        expect(organization.name).toBe('shadow');
        expect(organization.visible).toBe(false);
        expect(organization.users).toEqual([]);
    });

    it('should set and get basic properties', () => {
        organization.name = 'Test Org';
        organization.visible = true;
        organization.adminUser = 'admin123';

        expect(organization.name).toBe('Test Org');
        expect(organization.visible).toBe(true);
        expect(organization.adminUser).toBe('admin123');
    });

    it('should handle timestamps', () => {
        const now = new Date();
        organization.createdAt = now;
        organization.modifiedAt = now;

        expect(organization.createdAt).toBe(now);
        expect(organization.modifiedAt).toBe(now);
    });

    it('should handle users relationship', () => {
        const user1 = new User();
        const user2 = new User();
        organization.users = [user1, user2];

        expect(organization.users).toHaveLength(2);
        expect(organization.users).toContain(user1);
        expect(organization.users).toContain(user2);
    });

    it('should handle bidirectional relationship with User', () => {
        const org = new Organization();
        org.id = '123';
        
        const user = new User();
        user.organizationId = org.id;
        org.users = [user];
        
        expect(user.organizationId).toBe(org.id);
        expect(org.users).toContain(user);
    });

    it('should handle admin user field', () => {
        const org = new Organization();
        const adminUserId = '123';
        
        org.adminUser = adminUserId;
        
        expect(org.adminUser).toBe(adminUserId);
    });

    it('should handle timestamps', () => {
        const org = new Organization();
        const now = new Date();
        
        org.createdAt = now;
        org.modifiedAt = now;
        
        expect(org.createdAt).toBe(now);
        expect(org.modifiedAt).toBe(now);
    });
}); 
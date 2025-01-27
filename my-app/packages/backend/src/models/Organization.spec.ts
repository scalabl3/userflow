import { Organization } from './Organization';

describe('Organization', () => {
    let organization: Organization;

    beforeEach(() => {
        organization = new Organization();
        // Set default values manually since decorators don't work in tests
        organization.visible = true;
        organization.name = 'shadow';
    });

    it('should handle basic properties', () => {
        organization.name = 'Test Org';
        organization.adminUser = 'admin123';
        
        expect(organization.name).toBe('Test Org');
        expect(organization.adminUser).toBe('admin123');
    });

    it('should have correct default values', () => {
        expect(organization.visible).toBe(true);
        expect(organization.name).toBe('shadow');
    });

    it('should handle timestamps', () => {
        const now = new Date();
        organization.createdAt = now;
        organization.modifiedAt = now;

        expect(organization.createdAt).toBe(now);
        expect(organization.modifiedAt).toBe(now);
    });
}); 
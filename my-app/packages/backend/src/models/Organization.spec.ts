import { Organization } from './Organization';

describe('Organization', () => {
    let organization: Organization;

    beforeEach(() => {
        organization = new Organization();
    });

    it('should create an instance', () => {
        expect(organization).toBeTruthy();
    });

    it('should set adminUser', () => {
        organization.adminUser = 'admin123';
        expect(organization.adminUser).toBe('admin123');
    });

    it('should set name', () => {
        organization.name = 'Test Org';
        expect(organization.name).toBe('Test Org');
    });

    it('should set visible', () => {
        organization.visible = true;
        expect(organization.visible).toBe(true);
    });

    it('should handle timestamps', () => {
        const now = new Date();
        organization.createdAt = now;
        organization.modifiedAt = now;

        expect(organization.createdAt).toBe(now);
        expect(organization.modifiedAt).toBe(now);
    });
}); 
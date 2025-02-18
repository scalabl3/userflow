it('should initialize with default values', () => {
    expect(organization.name).toBe('shadow');
    expect(organization.visible).toBe(false);
    expect(organization.stripeCustomerId).toBeUndefined();
    expect(organization.subscriptionStatus).toBeUndefined();
    expect(organization.users).toHaveLength(0);
    expect(organization.adminUserId).toBeUndefined();
}); 
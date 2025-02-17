/**
 * Mock implementation of bcrypt for testing password operations.
 * Provides deterministic behavior for password hashing and comparison.
 * 
 * Core Features:
 * - Mock password hashing with predictable output
 * - Mock password comparison with controlled results
 * - Jest mock functions for verification
 * 
 * Test Categories:
 * - Password Creation: Testing hash generation
 * - Password Validation: Testing comparison logic
 * - Error Handling: Testing failure scenarios
 * 
 * Usage:
 * - Service Tests: Testing password operations
 * - Integration Tests: Mocking password functionality
 * - Security Tests: Testing auth flows
 * - Performance Tests: No actual hashing overhead
 * 
 * Implementation:
 * - hash: Always returns 'hashed_password'
 * - compare: Always returns true
 * - Both functions are Jest mocks for verification
 */
export const bcryptMock = {
    /** 
     * Mock implementation of password hashing.
     * Always returns 'hashed_password' for deterministic testing.
     * 
     * @type {jest.Mock<Promise<string>>}
     */
    hash: jest.fn().mockImplementation(async () => 'hashed_password'),

    /** 
     * Mock implementation of password comparison.
     * Always returns true for simplified testing.
     * Override implementation for negative test cases.
     * 
     * @type {jest.Mock<Promise<boolean>>}
     */
    compare: jest.fn().mockImplementation(async () => true)
}; 
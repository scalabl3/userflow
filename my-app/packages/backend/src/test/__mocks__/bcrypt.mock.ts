export const bcryptMock = {
    hash: jest.fn().mockImplementation(async () => 'hashed_password'),
    compare: jest.fn().mockImplementation(async () => true)
}; 
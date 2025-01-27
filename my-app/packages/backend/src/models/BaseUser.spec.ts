import { BaseUser } from './BaseUser';
import { LoginCredential } from './LoginCredential';
import { UserState } from '@my-app/shared/dist/enums/UserState';

describe('BaseUser', () => {
    let baseUser: BaseUser;
    let loginCredential: LoginCredential;

    beforeEach(() => {
        baseUser = new BaseUser();
        loginCredential = new LoginCredential();
        loginCredential.id = 'cred123';
        loginCredential.identifier = 'test@example.com';
        loginCredential.passwordHash = 'hashedPassword123';
    });

    it('should create an instance', () => {
        expect(baseUser).toBeTruthy();
    });

    it('should set basic properties', () => {
        baseUser.firstname = 'John';
        baseUser.lastname = 'Doe';
        baseUser.contactEmail = 'john@example.com';
        baseUser.state = UserState.ACTIVE;
        baseUser.isEnabled = true;

        expect(baseUser.firstname).toBe('John');
        expect(baseUser.lastname).toBe('Doe');
        expect(baseUser.contactEmail).toBe('john@example.com');
        expect(baseUser.state).toBe(UserState.ACTIVE);
        expect(baseUser.isEnabled).toBe(true);
    });

    it('should handle login credential relationship', () => {
        baseUser.primaryLoginCredentialId = loginCredential.id;
        expect(baseUser.primaryLoginCredentialId).toBe(loginCredential.id);
    });
}); 
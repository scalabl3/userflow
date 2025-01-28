# API Testing Strategy

## Overview
Our API testing approach uses NestJS's testing module with Supertest for HTTP assertions. We chose this combination for:
- Industry standard tools with large community support
- Direct integration with NestJS
- Clean, readable test syntax
- Excellent TypeScript support

## Current State and Migration Plan

### Current Test Structure
Currently, our tests have:
- Duplicated mock data across test files
- Individual test setups in each spec file
- No shared utilities for common operations
- Mixed testing approaches

### Migration Steps
1. **Create Shared Mocks**
   ```typescript
   // tests/__mocks__/user.mock.ts
   export const user = {
     base: {
       id: 'base-user-id',
       firstname: 'John',
       lastname: 'Doe',
       contactEmail: 'john@example.com',
       state: UserState.ACTIVE,
       isEnabled: true
     },
     standard: {
       id: 'user-id',
       username: 'johndoe',
       displayname: 'John Doe',
       organizationId: 'org-id'
     },
     dtos: {
       create: {
         firstname: 'John',
         lastname: 'Doe',
         username: 'johndoe',
         displayname: 'John Doe',
         contactEmail: 'john@example.com',
         organizationId: 'org-id'
       }
     }
   };
   ```

2. **Create Test Helpers**
   ```typescript
   // tests/helpers/test.helper.ts
   export class TestHelper {
     static async initDb() {
       // Common database initialization
     }

     static async loginUser(app: INestApplication) {
       // Login and return token
     }
   }
   ```

3. **Refactor Existing Tests**
   - Move duplicated mocks to shared location
   - Update imports to use shared mocks
   - Implement common test helpers
   - Standardize test patterns

4. **Migration Order**
   a. Create new structure without modifying existing tests
   b. Migrate one test suite at a time
   c. Validate each migration
   d. Remove old patterns once migration is complete

## Tools & Libraries
- `@nestjs/testing`: Core testing utilities from NestJS
- `jest`: Main test runner and assertion library
- `supertest`: HTTP testing library
- `sqlite3`: In-memory database for tests

## Project Structure

### Simplified Folder Structure
```
my-app/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── tests/              # Root test directory
│   │   │   │   ├── __mocks__/      # Consolidated mocks
│   │   │   │   │   ├── auth.mock.ts
│   │   │   │   │   └── user.mock.ts
│   │   │   │   ├── factories/      # Single factory
│   │   │   │   │   └── test-data.factory.ts
│   │   │   │   ├── helpers/        # Single helper
│   │   │   │   │   └── test.helper.ts
│   │   │   │   └── setup/          # Test setup
│   │   │   │       └── test.setup.ts
│   │   │   └── jest.config.ts
│   │   └── package.json
│   └── shared/
```

### Core Components

1. **Consolidated Mocks** (`__mocks__/`)
```typescript
// core.mock.ts
export const core = {
  ids: {
    organization: 'org-123',
    baseUser: 'base-user-123',
    user: 'user-123',
    emailProvider: 'email-provider-123',
    passwordCred: 'password-cred-123'
  },
  timestamps: {
    now: new Date('2024-01-01T00:00:00Z'),
    past: new Date('2023-01-01T00:00:00Z')
  }
};

// auth.mock.ts
export const auth = {
  providers: {
    email: {
      id: core.ids.emailProvider,
      code: 'email',
      name: 'Email Provider',
      isEnabled: true
    }
  },
  credentials: {
    password: {
      id: core.ids.passwordCred,
      identifier: 'john@example.com',
      loginProviderId: core.ids.emailProvider,
      credentialType: CredentialType.PASSWORD,
      passwordHash: 'hashed_password',
      baseUserId: core.ids.baseUser
    }
  },
  tokens: {
    valid: {
      accessToken: 'valid-jwt-token',
      refreshToken: 'valid-refresh-token'
    }
  }
};

// user.mock.ts
export const user = {
  base: {
    id: core.ids.baseUser,
    firstname: 'John',
    lastname: 'Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  },
  standard: {
    id: core.ids.user,
    baseUserId: core.ids.baseUser,
    username: 'johndoe',
    displayname: 'John Doe',
    organizationId: core.ids.organization
  },
  dtos: {
    create: {
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      displayname: 'John Doe',
      contactEmail: 'john@example.com',
      organizationId: core.ids.organization
    }
  },
  responses: {
    created: {
      id: core.ids.user,
      username: 'johndoe',
      displayname: 'John Doe'
    }
  }
};

// errors.mock.ts
export const errors = {
  validation: {
    missingField: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [{
        field: 'username',
        message: 'username is required'
      }]
    }
  },
  auth: {
    unauthorized: {
      statusCode: 401,
      message: 'Unauthorized'
    }
  }
};
```

2. **Enhanced Factory Pattern** (`factories/test-data.factory.ts`)
```typescript
export class TestDataFactory {
  // User factories
  static createUser(overrides = {}) {
    return { ...user.standard, ...overrides };
  }

  static createBaseUser(withCredentials = true, overrides = {}) {
    const baseUser = { ...user.base, ...overrides };
    if (withCredentials) {
      baseUser.loginCredentials = [auth.credentials.password];
    }
    return baseUser;
  }

  // Complex scenarios
  static async createFullUserSetup() {
    const baseUser = await this.createBaseUser();
    const user = await this.createUser({ baseUserId: baseUser.id });
    return { baseUser, user };
  }
}
```

3. **Unified Helper** (`helpers/test.helper.ts`)
```typescript
export class TestHelper {
  // Database management
  static async initDb() {
    // Initialize test database
  }

  static async clearDb() {
    // Clear test data
  }

  // Authentication
  static async loginUser(app: INestApplication) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(auth.requests.login.email)
      .expect(200);
    return response.body.accessToken;
  }

  // Common test setups
  static async setupTestUser(app: INestApplication) {
    const { user } = await TestDataFactory.createFullUserSetup();
    const token = await this.loginUser(app);
    return { user, token };
  }
}
```

### Import Strategy
```typescript
import { user, auth } from '@mocks';
import { TestDataFactory } from '@tests/factories';
import { TestHelper } from '@tests/helpers';
```

## Test Categories

### 1. Authentication Tests
- Login provider validation
- Credential verification
- Token management
- Session handling

### 2. User Management Tests
- User creation flow
- Profile updates
- Permission validation
- Account state management

### 3. Organization Tests
- Organization CRUD
- Member management
- Role assignments

## Test Flow Pattern
```typescript
describe('API Feature', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await TestHelper.initDb();
    const testUser = TestDataFactory.createUser();
    const token = await TestHelper.loginUser(app);
  });

  beforeEach(async () => {
    await TestHelper.clearDb();
  });

  it('should perform action', async () => {
    const result = await someService.action(user.dtos.create);
    expect(result).toMatchObject(user.standard);
  });
});
```

## Benefits of Simplified Structure

1. **Reduced Error Potential**
   - Centralized data in fewer files
   - Clear data ownership
   - Explicit relationships between mocks

2. **Easier Maintenance**
   - One place for related changes
   - Consistent patterns
   - Clear file ownership

3. **Better Organization**
   - Logical grouping of related data
   - Clear data hierarchies
   - Fewer files to manage

4. **Reduced Rework**
   - Reusable patterns
   - Shared utilities
   - Consistent approach

## Implementation Plan

1. **Phase 1: Core Structure**
   - Create `__mocks__` directory with auth and user mocks
   - Implement TestDataFactory
   - Setup TestHelper

2. **Phase 2: Migration**
   - Start with one test suite
   - Update imports to use new structure
   - Validate functionality
   - Proceed with remaining suites

3. **Phase 3: Cleanup**
   - Remove duplicate mocks
   - Standardize patterns
   - Update documentation

## Validation Strategy

1. **For Each Change**
   - Run existing tests
   - Verify no functionality loss
   - Check type safety
   - Validate relationships

2. **Final Verification**
   - All tests using shared mocks
   - No duplicate data
   - Consistent patterns
   - Clear documentation

## Usage Across Test Types

### 1. Service Tests
```typescript
describe('UserService', () => {
  let service: UserService;
  let mockUserRepo: MockRepository<User>;

  beforeEach(() => {
    mockUserRepo = TestHelper.createMockRepository();
    service = new UserService(mockUserRepo);
  });

  it('should create user', async () => {
    mockUserRepo.save.mockResolvedValue(user.standard);
    const result = await service.create(user.dtos.create);
    expect(result).toMatchObject(user.standard);
  });
});
```

### 2. Controller Tests
```typescript
describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(user.standard)
          }
        }
      ]
    }).compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  it('should create user', async () => {
    const result = await controller.create(user.dtos.create);
    expect(result).toMatchObject(user.responses.created);
  });
});
```

### 3. API Tests
```typescript
describe('User API', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
    await TestHelper.initDb();
    token = await TestHelper.loginUser(app);
  });

  beforeEach(async () => {
    await TestHelper.clearDb();
  });

  it('should create user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user.dtos.create)
      .expect(201);
    
    expect(response.body).toMatchObject(user.responses.created);
  });

  it('should handle validation errors', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({})
      .expect(400);
    
    expect(response.body).toMatchObject(errors.validation.missingField);
  });
});
```

## Implementation Plan

### Phase 1: Core Setup (Day 1-2)
1. Create directory structure
   ```
   src/tests/
   ├── __mocks__/
   │   ├── core.mock.ts
   │   ├── auth.mock.ts
   │   ├── user.mock.ts
   │   └── errors.mock.ts
   ├── factories/
   │   └── test-data.factory.ts
   └── helpers/
       └── test.helper.ts
   ```
2. Implement core mocks with IDs and timestamps
3. Setup basic TestHelper class
4. Create initial TestDataFactory

### Phase 2: Auth System (Day 3-4)
1. Implement auth mocks
   - Providers
   - Credentials
   - Tokens
2. Update auth service tests
   - Login flow
   - Token validation
   - Credential management
3. Update auth controller tests
4. Create auth API tests

### Phase 3: User System (Day 5-6)
1. Implement user mocks
   - Base user
   - Standard user
   - DTOs
   - Response shapes
2. Update user service tests
3. Update user controller tests
4. Create user API tests

### Phase 4: Migration (Day 7-8)
1. Start with one test suite
2. Update imports to use shared mocks
3. Validate functionality
4. Move to next suite
5. Document patterns

### Phase 5: Cleanup (Day 9-10)
1. Remove duplicate mocks
2. Standardize patterns
3. Add missing test cases
4. Update documentation

## Validation Strategy

### For Each Change
1. Run existing tests
2. Verify no functionality loss
3. Check type safety
4. Validate relationships

### Final Verification
1. All tests using shared mocks
2. No duplicate data
3. Consistent patterns
4. Clear documentation

## Benefits of This Approach

1. **Consistency**
   - Same mock data across all test types
   - Predictable test patterns
   - Clear relationship between entities

2. **Maintainability**
   - Single source of truth for test data
   - Easy to update related tests
   - Clear factory patterns

3. **Type Safety**
   - Mocks match actual types
   - Factory methods ensure valid data
   - Response shapes match API contracts

4. **Efficiency**
   - Reduced setup time for new tests
   - Faster test writing
   - Less duplicate code



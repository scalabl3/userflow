# API Testing Strategy

## Overview
Our testing strategy combines unit tests for individual components with feature-based integration tests for complete workflows. This approach ensures both granular component testing and verification of end-to-end business processes.

## Testing Structure

### Directory Organization
```
src/
├── models/                    # Domain models
│   ├── User.ts
│   └── User.spec.ts          # Unit tests alongside source
├── services/                 # Business logic
│   ├── UserService.ts
│   └── UserService.spec.ts   # Service unit tests
├── controllers/             # API endpoints
│   ├── UserController.ts
│   └── UserController.spec.ts # Controller unit tests
└── test/                    # Test infrastructure
    ├── __mocks__/           # Shared mock data
    │   ├── auth.mock.ts     # Authentication mocks
    │   ├── user.mock.ts     # User-related mocks
    │   └── core.mock.ts     # Common test data
    ├── factories/           # Test data factories
    │   └── test-data.factory.ts
    ├── helpers/             # Test utilities
    │   └── test.helper.ts
    └── integration/         # Integration tests
        ├── setup.ts         # Integration test configuration
        └── features/        # Feature-based tests
            ├── organization-management.integration.ts
            ├── user-management.integration.ts
            └── auth-management.integration.ts
```

### Testing Layers

1. **Unit Tests** (`*.spec.ts`)
   - Located alongside source files
   - Test individual components in isolation
   - Mock dependencies
   - Focus on component behavior

2. **Integration Tests** (`features/*.integration.ts`)
   - Feature-based organization
   - Test complete workflows
   - Use real database
   - Verify component interactions

## Feature-based Integration Tests

### Organization Management
```typescript
// features/organization-management.integration.ts
describe('Organization Management', () => {
  describe('Creating an organization', () => {
    it('should create organization with admin user', async () => {
      // Test organization creation with admin
    });

    it('should create organization with multiple users', async () => {
      // Test organization-user relationships
    });
  });

  describe('Managing organization users', () => {
    it('should add users to organization', async () => {
      // Test adding users
    });

    it('should remove users from organization', async () => {
      // Test removing users
    });
  });
});
```

### User Management
```typescript
// features/user-management.integration.ts
describe('User Management', () => {
  describe('User lifecycle', () => {
    it('should create user with organization', async () => {
      // Test user creation
    });

    it('should manage user state transitions', async () => {
      // Test state changes
    });
  });

  describe('User relationships', () => {
    it('should handle organization transfers', async () => {
      // Test org changes
    });
  });
});
```

### Authentication Management
```typescript
// features/auth-management.integration.ts
describe('Authentication Management', () => {
  describe('Credential management', () => {
    it('should create password credentials', async () => {
      // Test password auth
    });

    it('should handle OAuth flow', async () => {
      // Test OAuth
    });
  });

  describe('Login flows', () => {
    it('should authenticate with valid credentials', async () => {
      // Test login
    });
  });
});
```

## Test Infrastructure

### Mock Data Strategy
```typescript
// __mocks__/core.mock.ts
export const core = {
  ids: {
    organization: 'org-123',
    baseUser: 'base-user-123',
    user: 'user-123'
  },
  timestamps: {
    now: new Date('2024-01-01T00:00:00Z'),
    past: new Date('2023-01-01T00:00:00Z')
  }
};

// __mocks__/user.mock.ts
export const user = {
  base: {
    id: core.ids.baseUser,
    firstname: 'John',
    lastname: 'Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true
  }
};
```

### Test Helpers
```typescript
// helpers/test.helper.ts
export class TestHelper {
  static async setupTestDatabase() {
    // Initialize test database
    // Run migrations
    // Seed initial data
  }

  static async cleanupTestData() {
    // Clean database between tests
  }

  static async createTestUser(overrides = {}) {
    // Create user with default data
  }
}
```

## Database Strategy

### Test Database Setup
- Separate test database configuration
- Fresh database for each test suite
- Migrations run before tests
- Data cleanup after each test
- Test-specific seeds and fixtures

### Test Environment
```typescript
// integration/setup.ts
export const setupTestEnvironment = async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
};
```

## Best Practices

1. **Test Organization**
   - Group tests by feature/workflow
   - Clear test descriptions
   - Consistent naming conventions

2. **Data Management**
   - Use factories for test data
   - Clean state between tests
   - Avoid test interdependencies

3. **Assertions**
   - Verify complete response objects
   - Check database state
   - Validate relationships

4. **Error Handling**
   - Test error scenarios
   - Verify error responses
   - Check error details

## Tools & Libraries
- `@nestjs/testing`: NestJS testing utilities
- `jest`: Test runner and assertions
- `supertest`: HTTP testing
- `sqlite3`: Test database
- `typeorm`: Database ORM

## Implementation Order

### 1. Database Setup
- Configure SQLite test database
- Set up migration handling for tests
- Implement database cleanup utilities
- Create test data seeding helpers

### 2. Feature Implementation
1. **Organization Management**
   - Basic CRUD operations first
   - Then relationship management
   - Finally, complex workflows

2. **User Management**
   - User CRUD operations
   - Organization relationships
   - State management flows

3. **Authentication Management**
   - Credential management
   - Login flows
   - OAuth integration

### Implementation Principles
- Build one feature at a time
- Test thoroughly before moving on
- Avoid premature test generation
- Maintain alignment with unit tests
- Focus on real business workflows
- Reuse existing migrations



# Site Summary

## Overview
This document provides a comprehensive overview of the implemented project structure, architecture, and database design.

## Project Structure

### Root Structure
```
my-app/
├── packages/
│   ├── frontend/     # Not yet implemented
│   ├── backend/      # NestJS backend application
│   └── shared/       # Shared types, DTOs, and utilities
├── package.json      # Root package.json for workspace management
└── README.md        # Project documentation
```

### Package Details

#### Frontend Package (`/packages/frontend`)
Not yet implemented.

#### Backend Package (`/packages/backend`)
- **Technology Stack**: NestJS, TypeScript
- **Key Dependencies**:
  - `@nestjs/common`: ^10.0.0
  - `@nestjs/core`: ^10.0.0
  - `@nestjs/typeorm`: For database ORM
  - `typeorm`: For database management
  - `bcrypt`: For password hashing
  - `class-validator`: For DTO validation
  - `class-transformer`: For object transformation
  - `jest`: For testing
  - `supertest`: For API testing
- **Structure**:
  ```
  backend/
  ├── src/
  │   ├── controllers/   # HTTP request handlers
  │   ├── services/      # Business logic
  │   ├── models/        # Database entities
  │   ├── modules/       # NestJS modules
  │   ├── migrations/    # Database migrations
  │   └── test/         # Test files and mocks
  │       └── __mocks__/ # Shared test mocks
  ```

### Entity File Structure

#### User Entity Tree
```
├── models/
│   ├── BaseUser.ts              # Core user entity with auth relations
│   ├── User.ts                  # Extended user with org and preferences
│   └── User.spec.ts            # Entity unit tests and validation
├── services/
│   ├── BaseUserService.ts       # Core user and credential management
│   ├── BaseUserService.spec.ts  # Core service test coverage
│   ├── UserService.ts           # Extended user operations and org relations
│   └── UserService.spec.ts      # Extended service test coverage
├── controllers/
│   ├── BaseUserController.ts    # Core user CRUD endpoints
│   ├── UserController.ts        # Extended user and profile endpoints
│   └── UserController.spec.ts   # API endpoint testing
├── modules/
│   └── UserModule.ts            # User module configuration and DI
└── test/
    └── __mocks__/
        └── user.mock.ts         # User test data and factories
```

#### Organization Entity Tree
```
├── models/
│   ├── Organization.ts          # Organization entity with user relations
│   └── Organization.spec.ts     # Entity validation and constraints
├── services/
│   ├── OrganizationService.ts   # Organization and member management
│   └── OrganizationService.spec.ts # Service test coverage
├── controllers/
│   ├── OrganizationController.ts    # Organization management endpoints
│   └── OrganizationController.spec.ts # API endpoint testing
├── modules/
│   └── OrganizationModule.ts    # Organization module and dependencies
└── test/
    └── __mocks__/
        └── organization.mock.ts  # Organization test data
```

#### LoginCredential Entity Tree
```
├── models/
│   ├── LoginCredential.ts       # Auth credential entity and relations
│   └── LoginCredential.spec.ts  # Credential validation testing
├── services/
│   ├── LoginCredentialService.ts    # Credential and auth management
│   └── LoginCredentialService.spec.ts # Auth service testing
├── controllers/
│   ├── LoginCredentialController.ts  # Auth credential endpoints
│   └── LoginCredentialController.spec.ts # Auth API testing
├── modules/
│   └── LoginCredentialModule.ts # Auth module configuration
└── test/
    └── __mocks__/
        ├── auth.mock.ts         # Auth and credential test data
        └── bcrypt.mock.ts       # Password hashing mocks
```

#### LoginProvider Entity Tree
```
├── models/
│   ├── LoginProvider.ts         # Auth provider configuration entity
│   └── LoginProvider.spec.ts    # Provider validation testing
├── services/
│   ├── LoginProviderService.ts  # Provider management and config
│   └── LoginProviderService.spec.ts # Provider service testing
├── controllers/
│   ├── LoginProviderController.ts   # Provider configuration endpoints
│   └── LoginProviderController.spec.ts # Provider API testing
├── modules/
│   └── LoginProviderModule.ts   # Provider module setup
└── test/
    └── __mocks__/
        └── provider.mock.ts     # Provider configuration test data
```

#### Shared Package (`/packages/shared`)
- **Technology Stack**: TypeScript
- **Key Dependencies**:
  - `class-validator`: For DTO validation
  - `class-transformer`: For object transformation
- **Structure**:
  ```
  shared/
  ├── src/
  │   ├── dtos/         # Data Transfer Objects
  │   │   ├── LoginCredential/  # Authentication DTOs
  │   │   ├── User/            # User DTOs
  │   │   └── Organization/    # Organization DTOs
  │   ├── enums/        # Shared enumerations
  │   │   ├── CredentialType.ts
  │   │   └── UserState.ts
  │   └── utils/        # Shared utilities
  ```

## Testing Strategy

### Backend Testing
- **Framework**: Jest + Supertest
- **Mock Strategy**:
  - Shared mocks in `__mocks__` directory:
    - `core.mock.ts`: Common data (timestamps, IDs)
    - `auth.mock.ts`: Authentication/credentials data
    - `user.mock.ts`: User data
    - `organization.mock.ts`: Organization data
- **Test Structure**:
  - Unit tests alongside source files (`*.spec.ts`)
  - Integration tests in feature-based structure

### Integration Testing Strategy
- **Directory Structure**:
  ```
  src/test/
  ├── integration/
  │   ├── setup.ts                                    # Integration test setup & configuration
  │   └── features/
  │       ├── organization-management.integration.ts   # Organization-related features
  │       ├── user-management.integration.ts          # User-related features
  │       └── auth-management.integration.ts          # Authentication-related features
  ```

- **Feature-based Organization**:
  1. **Organization Management**:
     - Organization CRUD operations
     - Organization-User relationships
     - Admin user management
     - Member management workflows
  
  2. **User Management**:
     - User CRUD operations
     - User state management
     - User-Organization relationships
     - Profile management
  
  3. **Authentication Management**:
     - Login credential management
     - Login provider operations
     - Authentication flows
     - OAuth integration

- **Test Approach**:
  - Tests multiple components working together
  - Focuses on business workflows rather than individual operations
  - Verifies database relationships and constraints
  - Tests API endpoints with real database interactions
  - Ensures proper error handling and edge cases

- **Database Strategy**:
  - Separate test database
  - Fresh database for each test suite
  - Migrations run before tests
  - Data cleanup after each test
  - Test-specific seeds and fixtures

### Implemented Controllers
1. **LoginCredentialController**
   - POST `/login-credentials`: Create credential
   - GET `/login-credentials`: List credentials
   - GET `/login-credentials/:id`: Get credential
   - PUT `/login-credentials/:id`: Update credential
   - DELETE `/login-credentials/:id`: Remove credential

## Controller Strategy

### Base Controller Pattern
- All controllers follow RESTful principles
- Standard CRUD operations implemented consistently
- Dependency injection for services
- Strong typing with DTOs
- Async/await pattern throughout

### Controller Hierarchy
- **BaseUserController** (`/base-users`):
  - Core user management operations
  - Simple CRUD without complex error handling
  - Direct service delegation
   
- **LoginCredentialController** (`/login-credentials`):
  - Smart credential type routing
  - Handles both Password and OAuth flows
  - Type-specific validation
  - Response DTO transformation
   
- **OrganizationController** (`/organizations`):
  - Comprehensive error handling
  - Detailed API documentation
  - Response standardization
  - Service error mapping

### Error Handling Strategy
- Layered approach with service error interface
- Custom exception handling
- HTTP status code mapping
- Consistent error response format
- Proper null checking

### Authentication Strategy
- Credential type-based routing
- Separate flows for password and OAuth
- Strong type validation
- Secure credential management

### Response Handling
- Consistent use of DTOs
- Type transformation using plainToClass
- Default preferences for users:
  ```typescript
  preferences: {
      theme: 'light',
      notifications: { email: true, push: true }
  }
  ```
- Null checking and 404 handling
- Success message standardization
- Proper HTTP status codes (201 for creation, 204 for deletion)

### Endpoint Design
```
Base Users:
- POST   /base-users              # Create base user
- GET    /base-users             # List all base users
- GET    /base-users/:id         # Get base user by ID
- PATCH  /base-users/:id         # Partial update of base user
- DELETE /base-users/:id         # Delete base user

Users:
- POST   /users                  # Create user (returns ResponseUserDto)
- GET    /users                  # List all users (with optional username filter)
- GET    /users/:id             # Get user by ID
- GET    /users/username/:username # Get user by username
- PUT    /users/:id             # Update user
- DELETE /users/:id             # Delete user (returns 204 No Content)

Login Credentials:
- POST   /login-credentials     # Create credential (handles both OAuth and Password types)
- GET    /login-credentials     # List all credentials
- GET    /login-credentials/:id # Get credential by ID
- PUT    /login-credentials/:id # Update credential
- DELETE /login-credentials/:id # Remove credential (returns boolean)

Organizations:
- POST   /organizations        # Create organization (with error handling)
- GET    /organizations       # List all organizations
- GET    /organizations/:id   # Get organization by ID (404 if not found)
- PUT    /organizations/:id   # Update organization (404 if not found)
- DELETE /organizations/:id   # Delete organization (returns success message)

Login Providers:
- POST   /login-providers     # Create provider (returns ResponseLoginProviderDto)
- GET    /login-providers     # List all providers with mapped response
- GET    /login-providers/:id # Get provider by ID (404 if not found)
- PUT    /login-providers/:id # Update provider (404 if not found)
- DELETE /login-providers/:id # Remove provider (void, 404 if not found)
```

### Inheritance Strategy
- **User extends BaseUser**:
  - Single table inheritance using TypeORM
  - User endpoints handle both base and extended fields
  - Create operation sets up both user and base user data
  - Update operations can modify both levels
  - Relations are maintained at appropriate levels
  - Organization relationship only at User level
  - Authentication stays at BaseUser level

### Documentation and Testing
- JSDoc comments for endpoints
- Clear method descriptions
- Input/output type documentation
- Error scenarios documented
- Comprehensive test coverage
- Input validation testing
- Error scenario testing
- Response format validation

### Security Considerations
- Input validation
- Type checking
- Proper error masking
- Secure credential handling

### Code Organization
- Clear separation of concerns
- Consistent file naming
- Modular design
- Reusable interfaces
- Clean code practices

## Data Transfer Objects
- **Authentication**
  - LoginCredential DTOs: Password/OAuth credential management
  - LoginProvider DTOs: Provider configuration
- **User Management**
  - BaseUser DTOs: Core user data and state
  - User DTOs: Extended profile and preferences
- **Organization**
  - Organization DTOs: Company/team management

## Models

### Entity Relationships
- **User Management**
  - `BaseUser` → `LoginCredential`: One-to-many
  - `User` extends `BaseUser` and adds organization relationship
  - `User` → `Organization`: Many-to-one
- **Authentication**
  - `LoginCredential` → `LoginProvider`: Many-to-one
  - `LoginCredential` → `BaseUser`: Many-to-one
- **Organization**
  - `Organization` → `User`: One-to-many

### Key Features
- UUID primary keys throughout
- Timestamps on all entities
- Composite unique constraints
- Proper indexing
- TypeORM decorators

## Development Setup

### Workspace Configuration
- **Package Manager**: pnpm
- **Build Tools**:
  - Backend: NestJS CLI
  - Shared: TypeScript compiler

### Code Quality Tools
- **ESLint Configuration**:
  ```json
  {
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "root": true
  }
  ```
- **Prettier Configuration**:
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2
  }
  ```

## Development Practices

### Code Organization
- Feature-based module organization
- Consistent file naming conventions
- Shared test utilities and mocks

### Testing Practices
- Unit tests for services
- Integration tests for controllers
- Shared mock data for consistent testing

### Error Handling
- HTTP exception filters
- Validation pipe for DTOs
- Proper HTTP status codes

## Notes
This document reflects the current state of implementation and should be updated as new features are added.

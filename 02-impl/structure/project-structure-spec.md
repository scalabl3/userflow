# AI-Friendly Project Specification

## Project Structure Rules

### 1. Repository Organization
```
my-app/
├─ packages/
│  ├─ backend/        # API and business logic
│  ├─ frontend/       # UI components and pages
│  └─ shared/         # Shared types and utilities
├─ docs/              # Documentation
├─ tools/             # Build and deployment scripts
├─ .github/           # GitHub workflows
├─ package.json       # Root package.json
└─ ai-conventions.md  # This specification file
```

### 2. Naming Conventions

#### File Naming
- Use kebab-case for file names: `user-service.ts`
- Use PascalCase for component files: `UserProfile.tsx`
- Test files should end with `.test.ts` or `.spec.ts`
- Interface files should end with `.interface.ts`
- Type definition files should end with `.types.ts`
- DTOs should end with `.dto.ts`

#### Code Naming
- Interfaces: Prefix with 'I': `IUserService`
- Types: PascalCase: `UserProfile`
- React Components: PascalCase: `UserProfile`
- Services: Suffix with 'Service': `UserService`
- Controllers: Suffix with 'Controller': `UserController`
- Constants: UPPER_SNAKE_CASE: `MAX_RETRY_ATTEMPTS`

### 3. Import Rules

#### Order and Grouping
```typescript
// 1. Node built-in modules
import path from 'path';

// 2. External dependencies
import React from 'react';
import { Injectable } from '@nestjs/common';

// 3. Internal shared packages
import { IUser } from '@my-app/shared/interfaces';

// 4. Local imports (relative paths)
import { UserService } from './user.service';
```

### 4. Code Organization

#### Backend (packages/backend)
```
backend/
├─ src/
│  ├─ controllers/    # Route handlers
│  ├─ services/       # Business logic
│  ├─ models/         # Data models
│  ├─ middleware/     # Custom middleware
│  ├─ utils/          # Utility functions
│  └─ config/         # Configuration
```

#### Frontend (packages/frontend)
```
frontend/
├─ src/
│  ├─ components/     # Reusable UI components
│  ├─ pages/          # Page components
│  ├─ hooks/          # Custom React hooks
│  ├─ utils/          # Utility functions
│  ├─ services/       # API clients
│  └─ styles/         # Global styles
```

#### Shared (packages/shared)
```
shared/
├─ src/
│  ├─ dtos/          # Data transfer objects
│  ├─ interfaces/     # Shared interfaces
│  ├─ types/         # Type definitions
│  └─ utils/         # Shared utilities
```

### 5. Type Safety Rules

1. Always use strict TypeScript configurations:
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true
}
```

2. Avoid using `any` - use `unknown` if type is truly unknown
3. Define return types for all functions
4. Use interface instead of type when possible
5. Use enums for fixed sets of values

### 6. Documentation Rules

1. Every public function must have JSDoc comments
2. Include @param and @returns tags
3. Document exceptions with @throws
4. Include examples for complex functions

Example:
```typescript
/**
 * Creates a new user in the system
 * @param {CreateUserDTO} userData - The user data
 * @returns {Promise<User>} The created user
 * @throws {ValidationError} If email is invalid
 * @example
 * const user = await createUser({
 *   email: 'user@example.com',
 *   name: 'John Doe'
 * });
 */
```

### 7. Testing Rules

1. Test files should be co-located with source files
2. Use descriptive test names following format:
   `"[Unit of Work] should [Expected Behavior] when [State Under Test]"`
3. One assertion per test when possible
4. Use setup and teardown functions for common operations

### 8. Git Commit Rules

1. Use conventional commits:
```
feat: add user registration
fix: correct email validation
docs: update API documentation
```

2. Reference issue numbers when applicable
3. Keep commits atomic and focused
4. Include both what and why in commit messages

### 9. Error Handling Rules

1. Use custom error classes:
```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

2. Always include error codes
3. Log errors with appropriate levels
4. Handle async errors with try/catch

### 10. API Response Format

All API responses should follow this structure:
```typescript
interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    totalPages?: number;
    totalItems?: number;
  };
}
```

### 11. Component Rules

1. One component per file
2. Use functional components with hooks
3. Props interface must be defined
4. Use composition over inheritance

Example:
```typescript
interface UserProfileProps {
  userId: string;
  showDetails?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  showDetails = false
}) => {
  // Component logic
};
```

### 12. State Management Rules

1. Use context for global state
2. Local state with useState
3. Complex state with useReducer
4. Document state shape with interfaces

### 13. Build and Deploy Rules

1. Use environment variables for configuration
2. Never commit sensitive data
3. Use Docker for containerization
4. Include health check endpoints

## AI Instructions

When maintaining this codebase, AI should:

1. Always refer to this specification for structure and conventions
2. Generate test files alongside new code
3. Update documentation when modifying code
4. Ensure type safety across packages
5. Maintain consistent error handling
6. Follow the defined naming conventions
7. Keep package boundaries clear
8. Ensure atomic commits
9. Validate API response formats
10. Maintain component structure rules

Before generating code, AI should:

1. Identify which package(s) need modification
2. Check for existing patterns in similar files
3. Ensure all necessary types are defined in shared
4. Plan out the changes across all affected files
5. Consider impact on existing tests

## Version Control

This spec should be updated when:

1. New conventions are agreed upon
2. Best practices evolve
3. New packages are added
4. Build process changes

Always increment the version number when updating:
Current Version: 1.0.0

### Package Purposes

#### shared/ - Source of Truth
Purpose: Central source of truth for all data structures and types
- Ensures consistency across frontend and backend
- Prevents type drift between layers
- Enables strong type checking
- Forces explicit contract changes

#### backend/ - Business Logic Layer
Purpose: Implements core business rules and data handling
- Processes validated data only
- Enforces business constraints
- Manages data persistence
- Handles authentication/authorization

#### frontend/ - Presentation Layer
Purpose: Delivers two distinct user interfaces
1. Unauthenticated Marketing Layer
   - Public-facing marketing pages
   - Registration flows
   - Login interfaces
   - No business logic access, except for user registration and authentication

2. Authenticated Application Layer
   - Protected by authentication
   - Consumes business logic
   - Full feature access
   - User-specific interfaces

Common Responsibilities:
- Consumes shared types
- Handles presentation logic
- Manages appropriate state
- Implements UI patterns

### Key Principles
1. Shared First: Always define types in shared before implementing in other layers
2. Single Source: No duplicate type definitions across packages
3. Clear Boundaries: Each package has distinct responsibilities
4. Type Safety: All cross-package communication uses shared types

## Key Directories

### managers/
- Singleton pattern implementations
- Configuration management
- Event-driven updates
- Hot-reloading support
- Type-safe validation

### models/
- Database entity definitions
- Relationship mappings
- Validation decorators
- Type-safe enums

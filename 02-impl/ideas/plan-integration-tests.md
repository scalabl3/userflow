# Integration Tests Plan

## Phase 1: Core Entities (Now)
Testing the currently implemented entities and their direct relationships.

### 1. System Admin + Login Providers
```typescript
describe('Login Provider Management', () => {
  // Core Provider Setup
  it('should create password provider')
  it('should create OAuth provider')
  it('should prevent duplicate provider codes')
  
  // Basic Access Control
  it('should restrict provider creation to system admin')
  it('should allow provider listing for registration')
})
```

### 2. User Registration Flow
```typescript
describe('User Registration', () => {
  // BaseUser + LoginCredential
  it('should create BaseUser with password credential')
  it('should create BaseUser with OAuth credential')
  it('should enforce unique contact email')
  it('should enforce one credential per provider')
  
  // OAuth Specific
  it('should store OAuth tokens with credential')
  it('should handle OAuth profile data')
  
  // Apple Sign In Specific
  it('should handle Apple identity token')
  it('should store Apple-specific fields')
})
```

### 3. Basic Organization
```typescript
describe('Organization', () => {
  // Creation
  it('should create organization with first user')
  it('should allow user to create multiple organizations')
  it('should track creation timestamp')
  
  // Basic Membership
  it('should add user to organization')
  it('should remove user from organization')
  it('should allow user to belong to multiple organizations')
})
```

### 4. Data Isolation
```typescript
describe('Data Isolation', () => {
  // Basic Access Control
  it('should restrict organization data to members')
  it('should isolate user data between organizations')
  
  // System Admin Access
  it('should allow system admin to view providers')
  it('should allow system admin to list organizations')
})
```

## Phase 2: Future Features
These tests will be implemented after additional entities and features are added.

### 1. Role-Based Access
- Organization roles (admin, member, etc.)
- Role-based permissions
- Role assignment/management

### 2. Session Management
- Login session handling
- Token refresh flows
- Multi-organization session state
- Session expiration/revocation

### 3. Billing & Subscriptions
- Organization subscription tiers
- Feature access based on subscription
- Member limits
- Billing integration

### 4. Advanced Organization Features
- Organization settings/preferences
- Custom branding/themes
- Domain customization
- Organization templates

## Test Implementation Strategy

### Phase 1 Prerequisites
1. System Admin identification method
2. Login Provider entity
3. BaseUser + LoginCredential entities
4. Basic Organization + User entities

### Phase 1 Test Data
```typescript
// Core Factories
const loginProviderFactory = {
  createPassword: () => {...},
  createOAuth: (type) => {...},
  createApple: () => {...}
};

const baseUserFactory = {
  createWithPassword: () => {...},
  createWithOAuth: () => {...}
};

const organizationFactory = {
  createWithUser: (user) => {...}
};
```

### Phase 1 Setup Requirements
1. Clean database state between tests
2. System Admin identification
3. Mock OAuth providers
4. Mock Apple Sign In

### Phase 2 Dependencies
1. Role/Permission entities
2. Session management
3. Subscription/Billing entities
4. Organization customization features

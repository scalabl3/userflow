# Authentication Model Assessment

## Current Model Structure

### Entity Relationships
```
BaseUser [1] ----< [M] LoginCredential [M] >---- [1] LoginProvider
```

### Issues with Current Structure
1. **LoginProvider Issues**:
   - Missing `type` field to distinguish between auth methods
   - Missing type-specific configuration (currently no way to configure providers differently)
   - No validation based on provider type
   - No way to enforce provider-specific rules

2. **LoginCredential Issues**:
   - Mixing concerns by having all possible fields in one table
   - No clear separation between auth types
   - Validation can't be type-specific
   - No proper handling of temporary codes

3. **Relationship Issues**:
   - Current M:1 relationship between LoginCredential and LoginProvider means:
     - Can't enforce one credential per provider per user
     - No way to distinguish primary vs secondary (2FA) credentials
     - No clear ownership of configuration

## Proposed Model Structure

### Core Entities
```typescript
// LoginProviderType (Enum Table)
interface LoginProviderType {
    id: string;               // EMAIL_CODE, PASSWORD, SMS_CODE, OAUTH2, APPLE
    name: string;             // Display name
    configSchema: JsonSchema; // JSON Schema for provider config validation
    isEnabled: boolean;       // Global enable/disable
}

// LoginProvider
interface LoginProvider {
    id: UUID;
    type: LoginProviderType;  // Reference to type enum
    code: string;             // Unique identifier (e.g., 'google', 'github')
    name: string;             // Display name
    config: JsonB;            // Type-specific configuration
    isEnabled: boolean;       // Instance enable/disable
    validations: JsonB;       // Type-specific validation rules
}

// LoginCredential
interface LoginCredential {
    id: UUID;
    baseUserId: UUID;         // Reference to BaseUser
    providerId: UUID;         // Reference to LoginProvider
    identifier: string;       // Email/phone/OAuth ID
    credentialType: string;   // PRIMARY or SECONDARY (2FA)
    metadata: JsonB;          // Type-specific credential data
    isEnabled: boolean;
}
```

### Relationship Rules
1. **BaseUser to LoginCredential**:
   - One BaseUser can have multiple LoginCredentials
   - Each LoginCredential must belong to one BaseUser
   - Enforce at least one PRIMARY credential per user

2. **LoginCredential to LoginProvider**:
   - Each LoginCredential belongs to one LoginProvider
   - One LoginProvider can have many LoginCredentials
   - Enforce unique (baseUserId, providerId, credentialType)

3. **LoginProvider to LoginProviderType**:
   - Each LoginProvider must have one type
   - Config must validate against type's schema
   - Type determines available features/validations

### Type-Specific Storage

#### 1. Email Code
```typescript
// Provider Config
interface EmailCodeConfig {
    codeLength: number;
    expiryMinutes: number;
    maxAttempts: number;
    cooldownMinutes: number;
}

// Credential Metadata
interface EmailCodeMetadata {
    lastAttempt?: Date;
    attemptCount: number;
}

// Cache Storage
interface EmailCodeCache {
    code: string;
    expiresAt: Date;
    attempts: number;
}
```

#### 2. Password
```typescript
// Provider Config
interface PasswordConfig {
    minLength: number;
    requireSpecialChar: boolean;
    requireNumber: boolean;
    requireUppercase: boolean;
    maxAttempts: number;
}

// Credential Metadata
interface PasswordMetadata {
    passwordHash: string;
    lastPasswordChange: Date;
    resetToken?: string;
    resetTokenExpiry?: Date;
}
```

#### 3. SMS Code
```typescript
// Provider Config
interface SMSCodeConfig {
    codeLength: number;
    expiryMinutes: number;
    maxAttempts: number;
    cooldownMinutes: number;
    allowedCountryCodes: string[];
}

// Credential Metadata
interface SMSCodeMetadata {
    lastAttempt?: Date;
    attemptCount: number;
    verifiedAt?: Date;
}
```

#### 4. OAuth2
```typescript
// Provider Config
interface OAuth2Config {
    clientId: string;
    clientSecret: string;
    scopes: string[];
    authorizationUrl: string;
    tokenUrl: string;
    userInfoUrl: string;
    allowedDomains?: string[];
}

// Credential Metadata
interface OAuth2Metadata {
    accessToken: string;
    refreshToken?: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt?: Date;
    scope: string;
    rawProfile: JsonB;
}
```

#### 5. Apple
```typescript
// Provider Config
interface AppleConfig extends OAuth2Config {
    teamId: string;
    keyId: string;
    privateKey: string;
}

// Credential Metadata
interface AppleMetadata extends OAuth2Metadata {
    identityToken: string;
    authorizationCode?: string;
    realUserStatus: string;
    nonce?: string;
}
```

## Required Changes

### 1. Database Schema
- Create LoginProviderType enum table
- Add type and config to LoginProvider
- Reorganize LoginCredential fields
- Add proper indices and constraints

### 2. Model Layer
- Create type-specific interfaces
- Add validation per type
- Implement config validation
- Update relationship handling

### 3. Cache Layer
- Design cache key structure
- Implement TTL management
- Handle attempt tracking
- Support type-specific storage

### 4. Migration Strategy
1. Create new tables/columns
2. Migrate existing data
3. Add new constraints
4. Update application code
5. Remove deprecated fields 
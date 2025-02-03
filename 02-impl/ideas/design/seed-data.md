# Provider Type Seed Data

## LoginProviderType Seeds

```typescript
const loginProviderTypes = [
  {
    id: 'EMAIL_CODE',
    name: 'Email Code Authentication',
    configSchema: {
      type: 'object',
      required: ['codeLength', 'expiryMinutes', 'maxAttempts', 'cooldownMinutes'],
      properties: {
        codeLength: { type: 'number', minimum: 4, maximum: 8 },
        expiryMinutes: { type: 'number', minimum: 1, maximum: 60 },
        maxAttempts: { type: 'number', minimum: 1, maximum: 10 },
        cooldownMinutes: { type: 'number', minimum: 1, maximum: 1440 }
      }
    },
    isEnabled: true
  },
  {
    id: 'PASSWORD',
    name: 'Password Authentication',
    configSchema: {
      type: 'object',
      required: ['minLength', 'requireSpecialChar', 'requireNumber', 'requireUppercase', 'maxAttempts'],
      properties: {
        minLength: { type: 'number', minimum: 8, maximum: 128 },
        requireSpecialChar: { type: 'boolean' },
        requireNumber: { type: 'boolean' },
        requireUppercase: { type: 'boolean' },
        maxAttempts: { type: 'number', minimum: 1, maximum: 10 }
      }
    },
    isEnabled: true
  },
  {
    id: 'SMS_CODE',
    name: 'SMS Code Authentication',
    configSchema: {
      type: 'object',
      required: ['codeLength', 'expiryMinutes', 'maxAttempts', 'cooldownMinutes', 'allowedCountryCodes'],
      properties: {
        codeLength: { type: 'number', minimum: 4, maximum: 8 },
        expiryMinutes: { type: 'number', minimum: 1, maximum: 60 },
        maxAttempts: { type: 'number', minimum: 1, maximum: 10 },
        cooldownMinutes: { type: 'number', minimum: 1, maximum: 1440 },
        allowedCountryCodes: { 
          type: 'array',
          items: { type: 'string', pattern: '^\\+[1-9]\\d{0,2}$' }
        }
      }
    },
    isEnabled: true
  },
  {
    id: 'OAUTH2',
    name: 'OAuth2 Authentication',
    configSchema: {
      type: 'object',
      required: ['clientId', 'clientSecret', 'scopes', 'authorizationUrl', 'tokenUrl', 'userInfoUrl'],
      properties: {
        clientId: { type: 'string', minLength: 1 },
        clientSecret: { type: 'string', minLength: 1 },
        scopes: { 
          type: 'array',
          items: { type: 'string' }
        },
        authorizationUrl: { type: 'string', format: 'uri' },
        tokenUrl: { type: 'string', format: 'uri' },
        userInfoUrl: { type: 'string', format: 'uri' },
        allowedDomains: {
          type: 'array',
          items: { type: 'string', format: 'hostname' }
        }
      }
    },
    isEnabled: true
  },
  {
    id: 'APPLE',
    name: 'Sign in with Apple',
    configSchema: {
      type: 'object',
      required: ['clientId', 'teamId', 'keyId', 'privateKey', 'scopes'],
      properties: {
        clientId: { type: 'string', minLength: 1 },
        teamId: { type: 'string', minLength: 1 },
        keyId: { type: 'string', minLength: 1 },
        privateKey: { type: 'string', minLength: 1 },
        scopes: { 
          type: 'array',
          items: { type: 'string' }
        }
      }
    },
    isEnabled: true
  }
];

const defaultLoginProviders = [
  {
    type: 'EMAIL_CODE',
    code: 'email-code',
    name: 'Email Code Login',
    config: {
      codeLength: 6,
      expiryMinutes: 15,
      maxAttempts: 3,
      cooldownMinutes: 30
    },
    isEnabled: true
  },
  {
    type: 'PASSWORD',
    code: 'password',
    name: 'Password Login',
    config: {
      minLength: 8,
      requireSpecialChar: true,
      requireNumber: true,
      requireUppercase: true,
      maxAttempts: 5
    },
    isEnabled: true
  },
  {
    type: 'OAUTH2',
    code: 'google',
    name: 'Google Login',
    config: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scopes: ['email', 'profile'],
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    isEnabled: true
  }
];
```

## Benefits for Testing

1. **Type Validation**:
   - Known valid provider types
   - Schema validation for configs
   - Consistent error messages

2. **Mock Data**:
   ```typescript
   // Mock factory example
   export const createMockLoginProvider = (type: string, overrides = {}) => {
     const template = defaultLoginProviders.find(p => p.type === type);
     if (!template) throw new Error(`Unknown provider type: ${type}`);
     return { ...template, ...overrides };
   };
   ```

3. **Test Scenarios**:
   ```typescript
   describe('LoginProvider', () => {
     it('validates config against schema', () => {
       const provider = createMockLoginProvider('EMAIL_CODE', {
         config: { codeLength: 3 } // Should fail min value
       });
       expect(validateProvider(provider)).toBeFalsy();
     });
   });
   ```

## Migration Strategy

1. **Create Type Tables**:
   ```sql
   CREATE TABLE login_provider_types (
     id VARCHAR PRIMARY KEY,
     name VARCHAR NOT NULL,
     config_schema JSONB NOT NULL,
     is_enabled BOOLEAN DEFAULT true
   );
   ```

2. **Seed Data**:
   ```typescript
   await queryRunner.manager
     .createQueryBuilder()
     .insert()
     .into('login_provider_types')
     .values(loginProviderTypes)
     .execute();
   ```

3. **Update Providers**:
   ```typescript
   await queryRunner.manager
     .createQueryBuilder()
     .update('login_providers')
     .set({ type: 'PASSWORD' })
     .where({ code: 'password' })
     .execute();
   ``` 
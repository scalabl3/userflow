# User Authentication Design

## Overview
The user authentication system supports multiple login methods per user while maintaining security and data integrity.

## Entities

### LoginProvider (✓ Implemented)
- Represents available authentication methods
- Fields:
  - `id`: UUID
  - `code`: string (unique) - e.g., "email", "google", "phone"
  - `name`: string - Display name
  - `isEnabled`: boolean
  - `createdAt`: datetime
  - `modifiedAt`: datetime

### LoginCredential (✓ Implemented)
- Stores authentication credentials for each method
- Fields:
  - Common fields:
    - `id`: UUID
    - `identifier`: string - email, phone, oauth id, etc.
    - `loginProviderId`: UUID (references LoginProvider)
    - `credentialType`: enum - PASSWORD, OAUTH, PHONE
    - `isEnabled`: boolean
    - `createdAt`: datetime
    - `modifiedAt`: datetime

  - Password-specific fields:
    - `passwordHash`: string (nullable) - Only for password-based auth

  - OAuth-specific fields:
    - `provider`: enum - GOOGLE, GITHUB, APPLE
    - `accessToken`: string (nullable) - Current OAuth access token
    - `accessTokenExpiresAt`: datetime (nullable) - Access token expiration
    - `refreshToken`: string (nullable) - OAuth refresh token if available
    - `refreshTokenExpiresAt`: datetime (nullable) - Refresh token expiration
    - `scope`: string (nullable) - Granted OAuth scopes
    - `rawProfile`: JsonB (nullable) - Original OAuth profile data

    Apple-specific fields:
    - `identityToken`: string (nullable) - Apple's JWT token
    - `authorizationCode`: string (nullable) - For server-side validation
    - `realUserStatus`: string (nullable) - Apple's real user verification
    - `nonce`: string (nullable) - For PKCE flow

- Constraints:
  - Composite unique: (identifier, loginProviderId)
  - Foreign key: loginProviderId → LoginProvider.id
- Notes:
  - For password auth: only passwordHash is used
  - For OAuth: tokens, expiry, scope, and profile are used
  - For Apple: additional fields for Sign in with Apple requirements
  - For 2FA/MFA: can link multiple credentials to same user

### Organization (✓ Implemented)
- Fields:
  - `id`: UUID
  - `name`: string (default: 'shadow', nullable) - Organization display name
  - `visible`: boolean (default: false) - Controls organization visibility
  - `adminUserId`: UUID (required) - The user who administers this organization
  - `createdAt`: datetime
  - `modifiedAt`: datetime

- Relationships:
  - Users (1:M) - One organization can have many users
  - Billing (1:1) - TODO: Exactly One BillingProvider and BillingDetail
  - Subscriptions (1:1) - TODO: Exactly One SubscriptionType and SelectedSubscription

- Constraints:
  - Must have exactly one admin user
  - Cannot be deleted if it has active users
  - Name must be unique when visible is true
  - Shadow organizations (visible: false) can have duplicate names

- Notes:
  - New organizations default to shadow/invisible state
  - Admin user cannot be changed if organization has other active users
  - Organizations without users can be safely deleted
  - Future billing and subscription features will be added

### BaseUser (✓ Implemented)
- Core user identity and authentication
- Fields:
  - `id`: UUID
  - `firstname`: string
  - `lastname`: string
  - `contactEmail`: string (for notifications only)
  - `state`: enum (PENDING, ACTIVE, SUSPENDED, DEACTIVATED)
  - `primaryLoginCredentialId`: UUID (references LoginCredential)
  - `lastLoginAt`: datetime (nullable)
  - `isEnabled`: boolean
  - `createdAt`: datetime
  - `modifiedAt`: datetime
- Relationships:
  - One-to-Many with LoginCredential
  - One user can have multiple credentials but only one per provider

### User (✓ Implemented)
- Extends BaseUser with organization fields and user information
- Fields:
  - `username`: string (unique) - Public identifier
  - `displayname`: string - User's display name
  - `organizationId`: UUID (required) - User's organization
  - `preferences`: JSON (nullable)
    - theme: 'light' | 'dark'
    - notifications: { email?: boolean, push?: boolean }
- Relationships:
  - Organization (M:1) - Each user belongs to exactly one organization
  
- Constraints:
  - User must have exactly one organization
  - Multiple users can belong to the same organization
  - Username must be unique

## Authentication Flow
1. User provides identifier (email/phone/etc) and credentials
2. System looks up LoginProvider by code
3. System finds LoginCredential using (identifier, loginProviderId)
4. Validates credentials based on credentialType
5. Retrieves associated BaseUser

## OAuth Flow
1. User initiates OAuth with provider (e.g., Google, GitHub, Apple)
2. After OAuth success, system receives tokens and profile
3. System looks up or creates LoginCredential with:
   - identifier: OAuth user ID from provider
   - loginProviderId: matching provider
   - accessToken, refreshToken: from OAuth response
   - rawProfile: store complete profile data
4. Link to existing user or create new BaseUser
5. Update tokens on refresh/reauth

## Sign in with Apple Flow
1. User initiates Sign in with Apple
2. After successful authentication:
   - Receive identity token (JWT)
   - Receive authorization code
   - Get user's real status verification
   - Store nonce for PKCE
3. Validate identity token server-side
4. Exchange authorization code if needed
5. Create/update LoginCredential with Apple-specific fields
6. Link to existing user or create new BaseUser

## Implementation Order
1. ✓ LoginProvider - Basic provider information
2. → LoginCredential - Authentication methods and credentials
3. BaseUser - Core user identity
4. User - Extended user information

## Notes
- Start with email/password provider
- Add OAuth providers in order:
  1. Google (standard OAuth2)
  2. GitHub (standard OAuth2)
  3. Apple (custom implementation)
- Phone can be added as 2FA
- Keep it simple for 10K users
- No need for complex enterprise SSO


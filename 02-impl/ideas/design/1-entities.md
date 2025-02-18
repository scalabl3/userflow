# Entities Summary

## Overview
This document provides a comprehensive summary of the database entities, their relationships, constraints, and validation strategies within the application. It serves as a reference for developers and DBAs to understand the core data models and their interactions.

## User Entities

### Base User Entity Tree
```
├── models/
│   ├── BaseUser.ts              # Core user entity with authentication
│   └── BaseUser.spec.ts         # Base user validation tests
├── services/
│   ├── BaseUserService.ts       # Core user operations
│   └── BaseUserService.spec.ts  # Base service tests
├── controllers/
│   ├── BaseUserController.ts    # Base user endpoints
│   └── BaseUserController.spec.ts # Base controller tests
└── __mocks__/
    └── models/
        └── baseUser.mock.ts     # Base user test data
```

### BaseUser Relationships
```
BaseUser [1] ----< [M] LoginCredential
```

Key Characteristics:
- One-to-Many relationship with LoginCredential
- Cascade deletion of credentials with user
- Credentials are required for authentication
- Each credential has a unique type per user
- Soft deletion support for audit trail

### User Entity Tree (extends BaseUser)
```
├── models/
│   ├── User.ts                  # Extended user with org details
│   └── User.spec.ts             # Extended user validation
├── services/
│   ├── UserService.ts           # Extended user operations
│   └── UserService.spec.ts      # Extended service tests
├── controllers/
│   ├── UserController.ts        # Extended user endpoints
│   └── UserController.spec.ts   # Extended controller tests
└── __mocks__/
    └── models/
        └── user.mock.ts         # Extended user test data
```

### Key Relationships for Users
- User inherits LoginCredentials relationship from BaseUser
- User extends BaseUser (inheritance)
- User belongs to Organization (M:1)

## Organization Entities

### Organization Entity Tree
```
├── models/
│   ├── Organization.ts          # Organization entity
│   └── Organization.spec.ts     # Organization validation
├── services/
│   ├── OrganizationService.ts   # Organization operations
│   └── OrganizationService.spec.ts  # Service tests
├── controllers/
│   ├── OrganizationController.ts    # Organization endpoints
│   └── OrganizationController.spec.ts # Controller tests
└── __mocks__/
    └── models/
        └── organization.mock.ts  # Organization test data
```

### Key Relationships for Organizations
- Organization has many Users (1:M)
- Organization has one admin User (1:1)
- Organization has Stripe integration:
  - Stripe Customer ID for payment processing
  - Subscription status tracking
  - Payment processing handled by Stripe
  - No direct storage of payment methods

## Authentication Entities

### Login Credential Entity Tree
```
├── models/
│   ├── LoginCredential.ts       # Credential storage
│   └── LoginCredential.spec.ts  # Credential validation
├── managers/
│   └── auth/
│       ├── AuthenticationManager.ts  # Auth singleton
│       └── auth.config.ts           # Auth configuration
└── __mocks__/
    └── models/
        └── loginCredential.mock.ts  # Credential test data
```

### Authentication Entity Relationships

#### LoginCredential to AuthenticationManager
```
LoginCredential [M] -----> [1] AuthenticationManager (Singleton)
```

Key Characteristics:
- Many-to-One conceptual relationship (M:1)
- LoginCredential references CredentialType from AuthenticationManager
- AuthenticationManager provides configuration and validation
- No database relationship (AuthenticationManager is a singleton)
- Configuration loaded from auth.config.json in root
- Hot-reloading support for configuration changes

Implementation Notes:
- LoginCredential uses CredentialType enum for type safety
- AuthenticationManager validates credentials based on type
- Configuration changes trigger events for subscribers
- Credential validation rules defined in AuthenticationManager
- Type-specific validation logic encapsulated in manager

## Payment Integration Entities

### Payment Method Entity Tree
```
├── models/
│   ├── CustomerPaymentMethod.ts       # Payment method entity
│   └── CustomerPaymentMethod.spec.ts  # Payment validation
├── services/
│   ├── CustomerPaymentMethodService.ts    # Payment operations
│   └── CustomerPaymentMethodService.spec.ts # Service tests
├── managers/
│   └── payment/                      # Future payment manager
└── __mocks__/
    └── models/
        └── payment.mock.ts           # Payment test data
```

### Stripe Integration
The Organization entity includes Stripe-specific fields:
- `stripeCustomerId`: String (255 chars) for Stripe Customer ID
- `subscriptionStatus`: Enum for subscription state tracking

CustomerPaymentMethod entity includes:
- Masked card details
- Card type and expiration
- Stripe payment method token
- Default payment method flag

### Payment Integration Relationships
```
Organization [1] ----< [M] CustomerPaymentMethod
```

Key Characteristics:
- One-to-Many relationship (1:M)
- Organization owns payment methods
- Soft deletion support
- Default payment method tracking
- Stripe token storage

## Entity Relationships and Validation

- All entities use UUIDs as primary keys
- Timestamps and audit fields on all entities
- Soft deletion support where appropriate
- Type-safe enums for status fields
- Proper indexing for relationships
- Composite unique constraints as needed

## Testing Strategy

- Entity validation tests
- Relationship integrity tests
- Mock data for all entities
- Consistent test patterns
- Transaction testing
- Soft delete verification

## Security Notes

- No sensitive payment data stored
- Stripe handles payment processing
- Secure token storage
- Webhook signature verification
- Organization-level access control
- Audit trail maintenance 
# Entities Summary

## Overview
This document provides a comprehensive summary of the database entities, their relationships, constraints, and validation strategies within the application. It serves as a reference for developers and DBAs to understand the core data models and their interactions.

## User Entities

### User Entity Tree
```
├── models/
│   ├── BaseUser.ts              # Core user entity with authentication relations
│   ├── User.ts                  # Extended user entity with organizational and preference details
│   └── User.spec.ts             # Unit tests for user validation
├── services/
│   ├── BaseUserService.ts       # Core user service handling basic operations
│   ├── BaseUserService.spec.ts  # Tests for base service operations
│   ├── UserService.ts           # Extended service including org and preference logic
│   └── UserService.spec.ts      # Extended service test coverage
├── controllers/
│   ├── BaseUserController.ts    # Handles core user CRUD endpoints
│   ├── UserController.ts        # Manages extended user operations
│   └── UserController.spec.ts   # Controller tests
└── test/
    └── __mocks__/
        └── user.mock.ts         # Shared mock data for user entities
```

### Key Relationships for Users
- One-to-many relationship between a User and their LoginCredentials
- Each User is associated with an Organization

## Organization Entities

### Organization Entity Tree
```
├── models/
│   ├── Organization.ts          # Defines the organization structure and user associations
│   └── Organization.spec.ts     # Validation and constraint tests
├── services/
│   ├── OrganizationService.ts   # Manages organization creation and member relations
│   └── OrganizationService.spec.ts  # Service test coverage
├── controllers/
│   ├── OrganizationController.ts    # API endpoints for organization management
│   └── OrganizationController.spec.ts # Controller tests
└── test/
    └── __mocks__/
        └── organization.mock.ts  # Fixture data for organizations
```

### Key Relationships for Organizations
- An Organization has many Users
- Enforced unique constraints on organization identifiers and names

## Authentication Entities

### Login Credential Entity Tree
```
├── models/
│   ├── LoginCredential.ts       # Stores user authentication details
│   └── LoginCredential.spec.ts  # Security and validation tests
```

### Login Provider Entity Tree
```
├── models/
│   ├── LoginProvider.ts         # Configures external authentication providers (OAuth, etc.)
│   └── LoginProvider.spec.ts    # Tests for provider configuration
```

### Stripe Integration in Entities

The Organization entity has been extended to support Stripe payment processing. The following fields have been added:
- `stripeCustomerId`: A string (up to 255 characters) that stores the Stripe Customer ID associated with the organization.
- `subscriptionStatus`: A string (up to 50 characters) indicating the current subscription status (e.g., 'active', 'past_due', 'canceled').

These fields are used to manage payment integrations and track subscription statuses via Stripe.

## Payment Method Entity

The CustomerPaymentMethod entity is used to store detailed payment method information associated with an organization. It typically includes:
- Card details (stored in a secure, masked format)
- Expiration dates and card type
- A token or reference ID provided by Stripe

This entity works in conjunction with the Stripe fields in the Organization entity to manage recurring billing and payment validations.

## Entity Relationships and Validation

- All entities use UUIDs as primary keys for consistency.
- Timestamps and audit fields (createdAt, updatedAt) are maintained across entities.
- Composite unique constraints and proper indexing are applied where necessary.
- Inheritance patterns are leveraged for shared fields and relationships.

## Testing Strategy and Data Seeding

- Comprehensive unit tests for entity validations and constraints.
- Integration tests to ensure relationship integrity across entities.
- Use of shared mocks and fixture data for repeatable tests.

## Notes

4. **Security Notes**:
   - No sensitive payment data stored locally
   - All payment processing through Stripe
   - Webhook signature verification
   - Secure API key handling
   - Organization-level access control 
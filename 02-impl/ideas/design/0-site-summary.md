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
└── README.md         # Project documentation
```

### Package Details

#### Frontend Package (`/packages/frontend`)
Not yet implemented.

#### Backend Package (`/packages/backend`)
- **Technology Stack**: NestJS, TypeScript
- **Key Dependencies**: @nestjs/common, @nestjs/core, @nestjs/typeorm, typeorm, bcrypt, class-validator, class-transformer, jest, supertest
- **Structure**:
```
backend/
├── src/
│   ├── controllers/   # HTTP request handlers
│   ├── services/      # Business logic
│   ├── models/        # Database entities
│   ├── managers/      # Singleton managers
│   │   └── auth/      # Authentication management
│   ├── modules/       # NestJS modules
│   ├── migrations/    # Database migrations
│   ├── utils/         # Utility functions
│   ├── constants/     # Shared constants
│   ├── __mocks__/     # Mock data for testing
│   └── test/          # Test utilities and helpers
├── tsconfig.json      # TypeScript configuration
└── package.json       # Package dependencies
```

#### Shared Package (`/packages/shared`)
- **Overview**: Contains shared types, DTOs, enumerations, and utilities used by both frontend and backend.
- **Structure**:
```
shared/
├── src/
│   ├── dtos/         # Data Transfer Objects
│   ├── enums/        # Shared enumerations
│   └── utils/        # Utility functions
```

## Entity File Structure

### User Entity Tree
```
├── models/
│   ├── BaseUser.ts              # Core user entity with auth relations
│   ├── User.ts                  # Extended user with org and preferences
│   └── User.spec.ts             # Entity unit tests
├── services/
│   ├── BaseUserService.ts 
│   ├── BaseUserService.spec.ts  
│   ├── UserService.ts           
│   └── UserService.spec.ts      
├── controllers/
│   ├── BaseUserController.ts    
│   ├── UserController.ts        
│   └── UserController.spec.ts   
└── test/
    └── __mocks__/
        └── user.mock.ts         
```

### Organization Entity Tree
```
├── models/
│   ├── Organization.ts          # Organization entity with user relations
│   └── Organization.spec.ts     # Entity validation and constraints
├── services/
│   ├── OrganizationService.ts   
│   └── OrganizationService.spec.ts 
├── controllers/
│   ├── OrganizationController.ts   
│   └── OrganizationController.spec.ts
└── test/
    └── __mocks__/
        └── organization.mock.ts  
```

## Payment Integration

### Payment Integration Tree
```
├── models/
│   ├── Organization.ts                # Includes stripeCustomerId
│   ├── CustomerPaymentMethod.ts       # Stripe payment method references
│   └── CustomerPaymentMethod.spec.ts  # Payment method validation
├── services/
│   ├── StripeService.ts               # Core Stripe integration
│   ├── StripeService.spec.ts          # Stripe service testing
│   ├── CustomerPaymentMethodService.ts    # Payment method management
│   └── CustomerPaymentMethodService.spec.ts # Service testing
├── controllers/
│   ├── StripeController.ts            # Payment and webhook endpoints
│   └── StripeController.spec.ts       # Payment API testing
├── config/
│   └── stripe.config.ts               # Stripe configuration
└── test/
    └── __mocks__/
        ├── stripe.mock.ts             # Stripe test data
        └── payment.mock.ts            # Payment method test data
```

### Endpoint Design
```
Stripe Integration:
- POST   /organizations/:organizationId/stripe/webhook           # Stripe webhook handler
- POST   /organizations/:organizationId/stripe/payment-methods     # Add payment method
- GET    /organizations/:organizationId/stripe/payment-methods     # List organization's payment methods
- PATCH  /organizations/:organizationId/stripe/payment-methods/:id  # Update payment method (set default)
- DELETE /organizations/:organizationId/stripe/payment-methods/:id  # Remove payment method
```

## Testing Strategy

- **Backend Testing**: Utilizes Jest and Supertest with feature-based integration tests.
- **Integration Testing**: Covers organization management, user management, and payment flows using real data and mocks.
- **Mock Data**: Shared test mocks are maintained for consistency across modules.

## Development Practices

- **Code Organization**: Modular design following separation of concerns principles.
- **Error Handling**: Standardized exception handling and HTTP status codes.
- **Documentation**: Comprehensive JSDoc comments and method-level documentation.

## Notes

This document reflects the current state of implementation and should be updated as new features are added.

# Application Architecture

## Core Components

### Singleton Managers
Located in `backend/src/managers/`, these provide centralized management of system-wide functionality:

1. Authentication Manager
   - Credential type management
   - Provider configuration
   - Validation rules
   - Hot-reloading support
   - Event-driven updates

2. Future Managers (planned)
   - Notification Manager: Push notifications, emails
   - Payment Manager: Payment processing, subscriptions
   - Cache Manager: System-wide caching
   - Feature Flag Manager: Feature toggles

Key Characteristics:
- Singleton pattern implementation
- Configuration management
- Event-driven architecture
- Hot-reloading capability
- Type-safe interfaces

### Authentication System
The authentication system uses a singleton manager pattern:

1. Components:
   - AuthenticationManager: Central singleton for auth logic
   - LoginCredential: Database entity for stored credentials
   - CredentialType: Type-safe enum for auth methods

2. Features:
   - Multiple authentication methods (OAuth, password, etc.)
   - Centralized configuration
   - Hot-reloadable settings
   - Type-safe credential validation
   - Event-driven updates 
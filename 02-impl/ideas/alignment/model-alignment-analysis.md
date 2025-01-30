# Model Alignment Analysis

## Overview
After standardizing our models and migrations, several other layers need to be updated to maintain consistency. This document outlines the required changes by layer.

## 1. DTO Layer

### LoginCredential DTOs
- **Issue**: DTOs expect direct access to `scope` and `rawProfile` which are now nested in `profile`
- **Required Changes**:
  - Update `ResponseLoginCredentialDto` to handle nested profile structure
  - Modify `CreateLoginCredentialDto` to accept profile as a nested object
  - Update validation decorators to match model standards

### Organization DTOs
- **Issue**: DTOs use string for adminUser where model expects User object
- **Required Changes**:
  - Update `CreateOrganizationDto` to use adminUserId instead of adminUser
  - Modify `UpdateOrganizationDto` to handle adminUserId properly
  - Ensure response DTOs properly transform relationships

### User DTOs
- **Issue**: Response transformations don't match model structure
- **Required Changes**:
  - Update DTO transformations for organization relationship
  - Align preference structure with model

## 2. Service Layer

### OrganizationService
- **Issue**: Type mismatches between DTOs and model in create/update operations
- **Required Changes**:
  - Update create method to properly handle adminUserId
  - Modify update method to handle relationship changes
  - Fix type assertions in service methods

### LoginCredentialService
- **Issue**: Profile handling doesn't match new model structure
- **Required Changes**:
  - Update profile handling in create/update methods
  - Modify OAuth credential handling
  - Fix type assertions for nested objects

### UserService
- **Issue**: Response transformations don't match model
- **Required Changes**:
  - Update response transformations
  - Fix relationship handling

## 3. Test Layer

### Controller Tests
- **Issue**: Mock data doesn't match model structure
- **Required Changes**:
  - Update `LoginCredentialController.spec.ts` mock data
  - Fix `OrganizationController.spec.ts` relationship mocks
  - Update `UserController.spec.ts` response expectations

### Service Tests
- **Issue**: Mock data and assertions don't match model
- **Required Changes**:
  - Update `OrganizationService.spec.ts` relationship handling
  - Fix `LoginCredentialService.spec.ts` profile assertions
  - Modify `UserService.spec.ts` mock data

### Model Tests
- **Issue**: Direct property access tests don't match model
- **Required Changes**:
  - Update `LoginCredential.spec.ts` profile tests
  - Fix `Organization.spec.ts` relationship tests
  - Modify `User.spec.ts` preference tests

## 4. Mock Data

### Auth Mocks
- **Issue**: Incorrect structure for LoginCredential mocks
- **Required Changes**:
  - Update profile structure in credentials
  - Fix relationship mocks
  - Add missing required properties

### Organization Mocks
- **Issue**: Incorrect adminUser handling
- **Required Changes**:
  - Update to use adminUserId consistently
  - Fix relationship structure
  - Update type assertions

### User Mocks
- **Issue**: Incorrect relationship and preference structure
- **Required Changes**:
  - Update organization relationship mocks
  - Fix preference structure
  - Update type assertions

## Implementation Strategy

### Phase 1: DTO Alignment
1. Update DTO structures to match models
2. Fix validation decorators
3. Update transformation logic

### Phase 2: Service Alignment
1. Fix type handling in services
2. Update relationship management
3. Modify response transformations

### Phase 3: Test Alignment
1. Update mock data structures
2. Fix test assertions
3. Update relationship tests

### Phase 4: Mock Data Cleanup
1. Standardize mock structures
2. Fix relationship mocks
3. Update type assertions

## Notes
- All changes should maintain existing functionality
- Updates should follow established patterns
- No changes to model structure needed
- Migration changes already complete 
# DTO Update Checklist

## Overview
This checklist helps ensure consistent updates when standardizing DTOs across the codebase.

## Pre-Update Checks
- [ ] List all DTOs for the entity
- [ ] Identify all relationships
- [ ] Note any circular references
- [ ] Check for inheritance patterns
- [ ] Review current validation rules

## Create DTO Updates
- [ ] Rename relationship fields to use `Id` suffix
- [ ] Replace nested objects with UUID fields
- [ ] Add proper UUID validation
- [ ] Update API documentation
- [ ] Remove any type transformations
- [ ] Verify required vs optional fields
- [ ] Add clear validation messages

## Update DTO Updates
- [ ] Make all fields optional
- [ ] Use same field names as Create DTO
- [ ] Maintain same validation rules
- [ ] Update API documentation
- [ ] Remove any nested objects
- [ ] Add proper UUID validation
- [ ] Verify validation messages

## Response DTO Updates
- [ ] Add `@Exclude()` class decorator
- [ ] Add `@Expose()` to all fields
- [ ] Replace ID fields with full objects
- [ ] Add proper `@Type()` decorators
- [ ] Initialize arrays as empty arrays
- [ ] Update API documentation
- [ ] Handle circular references

## Documentation Updates
- [ ] Update field descriptions
- [ ] Add realistic example values
- [ ] Document validation rules
- [ ] Note relationship requirements
- [ ] Update API versioning if needed

## Testing Requirements
- [ ] Test Create DTO validation
- [ ] Test Update DTO validation
- [ ] Test Response DTO transformation
- [ ] Test circular reference handling
- [ ] Test inheritance behavior
- [ ] Verify API documentation

## Entity-Specific Checklist

### BaseUser
- [ ] Update `loginCredentials` relationship
- [ ] Handle state enum validation
- [ ] Update preference fields

### User
- [ ] Update `organization` relationship
- [ ] Handle inheritance from BaseUser
- [ ] Update preference validation

### Organization
- [ ] Update `adminUser` relationship
- [ ] Update `users` relationship
- [ ] Handle visibility flags

### LoginCredential
- [ ] Update `loginProvider` relationship
- [ ] Update `baseUser` relationship
- [ ] Handle credential type validation

### LoginProvider
- [ ] Update `credentials` relationship
- [ ] Handle provider code validation

### BillingProvider
- [ ] Update type validation
- [ ] Handle enabled/visible flags

## Final Verification
- [ ] All DTOs follow naming conventions
- [ ] No mixed relationship patterns
- [ ] Consistent validation messages
- [ ] Complete API documentation
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Swagger documentation accurate 
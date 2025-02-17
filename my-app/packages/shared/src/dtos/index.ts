/**
 * Central export point for all Data Transfer Objects (DTOs).
 * Organizes and exports DTOs by entity type and operation.
 * 
 * Core Features:
 * - Centralized DTO management
 * - Organized by entity type
 * - Operation-specific DTOs
 * - Type-safe data transfer
 * 
 * Categories:
 * 1. Authentication:
 *    - LoginProvider: Provider management
 *    - LoginCredential: Credential handling
 * 
 * 2. User Management:
 *    - User: Organization-specific users
 *    - BaseUser: Core user functionality
 * 
 * 3. Organization:
 *    - Organization: Business entity management
 * 
 * Operations:
 * - Create: Data for entity creation
 * - Update: Partial updates and modifications
 * - Response: Standardized API responses
 * 
 * Usage:
 * - API request/response typing
 * - Data validation
 * - Documentation generation
 * - Type safety enforcement
 */

// Export LoginProvider DTOs
export * from './LoginProvider/CreateLoginProviderDto';
export * from './LoginProvider/UpdateLoginProviderDto';
export * from './LoginProvider/ResponseLoginProviderDto';

// Export LoginCredential DTOs and enums
export * from './LoginCredential/CreateLoginCredentialDto';
export * from './LoginCredential/UpdateLoginCredentialDto';
export * from './LoginCredential/ResponseLoginCredentialDto';

// User DTOs
export * from './User/CreateUserDto';
export * from './User/UpdateUserDto';
export * from './User/ResponseUserDto';

// BaseUser DTOs
export * from './BaseUser/CreateBaseUserDto';
export * from './BaseUser/UpdateBaseUserDto';
export * from './BaseUser/ResponseBaseUserDto';

// Organization DTOs
export * from './Organization/CreateOrganizationDto';
export * from './Organization/UpdateOrganizationDto';
export * from './Organization/ResponseOrganizationDto';

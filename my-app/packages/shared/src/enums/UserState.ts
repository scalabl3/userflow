/**
 * User account states representing different lifecycle stages.
 * Controls user access and system behavior based on account status.
 * 
 * Core Features:
 * - Account lifecycle management
 * - Access control states
 * - User status tracking
 * 
 * State Flow:
 * 1. PENDING: Initial state after account creation
 * 2. ACTIVE: Normal operational state
 * 3. SUSPENDED: Temporary access restriction
 * 4. DEACTIVATED: Permanent account closure
 * 
 * Usage:
 * - User access control
 * - Account status validation
 * - State transition management
 * - Security enforcement
 * 
 * @enum {string}
 */
export enum UserState {
    /** Initial state for newly created accounts pending verification */
    PENDING = 'PENDING',
    /** Normal operational state with full system access */
    ACTIVE = 'ACTIVE',
    /** Temporary restriction state with limited access */
    SUSPENDED = 'SUSPENDED',
    /** Terminal state for closed or removed accounts */
    DEACTIVATED = 'DEACTIVATED'
} 
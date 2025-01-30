/**
 * Standardized field length constraints for the application.
 * These constants should be used consistently across:
 * 1. Database migrations
 * 2. Model validations
 * 3. DTO validations
 */

type FieldLength = { readonly MIN: number; readonly MAX: number };

export type FieldLengthsType = {
    readonly NAME: FieldLength;
    readonly USERNAME: FieldLength;
    readonly DISPLAYNAME: FieldLength;
    readonly EMAIL: FieldLength;
    readonly CODE: FieldLength;
    readonly DESCRIPTION: FieldLength;
    readonly NOTE: FieldLength;
    // Authentication Fields
    readonly IDENTIFIER: FieldLength;
    readonly PASSWORD_HASH: FieldLength;
    readonly TOKEN: FieldLength;  // For OAuth tokens (access, refresh, identity)
    readonly AUTH_CODE: FieldLength;
    readonly REAL_USER_STATUS: FieldLength;
    readonly NONCE: FieldLength;
};

type FieldKey = keyof FieldLengthsType;

export const FieldLengths: FieldLengthsType & {
    getMessage: (
        field: FieldKey,
        type?: 'length' | 'required' | 'format'
    ) => string;
} = {
    // User Identity Fields
    NAME: {
        MIN: 1,
        MAX: 30,  // firstname, lastname
    },
    USERNAME: {
        MIN: 3,
        MAX: 30,
    },
    DISPLAYNAME: {
        MIN: 1,
        MAX: 15,
    },
    EMAIL: {
        MIN: 5,
        MAX: 255,  // Following RFC 5321
    },

    // Common Text Fields
    CODE: {
        MIN: 1,
        MAX: 50,  // For system codes, identifiers
    },
    DESCRIPTION: {
        MIN: 0,
        MAX: 1000,  // For longer text fields
    },
    NOTE: {
        MIN: 0,
        MAX: 500,  // For medium-length notes
    },

    // Authentication Fields
    IDENTIFIER: {
        MIN: 1,
        MAX: 255,  // Email/username/phone for login
    },
    PASSWORD_HASH: {
        MIN: 1,
        MAX: 255,  // Bcrypt hash length
    },
    TOKEN: {
        MIN: 1,
        MAX: 2048,  // OAuth tokens can be long
    },
    AUTH_CODE: {
        MIN: 1,
        MAX: 255,  // OAuth authorization codes
    },
    REAL_USER_STATUS: {
        MIN: 1,
        MAX: 50,  // Apple Sign In status
    },
    NONCE: {
        MIN: 1,
        MAX: 100,  // Security nonce
    },

    // Error Messages
    getMessage: (
        field: FieldKey,
        type: 'length' | 'required' | 'format' = 'length'
    ): string => {
        const fieldName = String(field);
        switch (type) {
            case 'length':
                const constraint = FieldLengths[field];
                return `${fieldName} must be between ${constraint.MIN} and ${constraint.MAX} characters`;
            case 'required':
                return `${fieldName} is required`;
            case 'format':
                return `${fieldName} format is invalid`;
            default:
                return `Invalid ${fieldName}`;
        }
    }
}; 

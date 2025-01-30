import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { FieldLengths, type FieldLengthsType } from '../constants/field-lengths';

type FieldKey = keyof FieldLengthsType;
type NameFieldKey = 'NAME' | 'USERNAME' | 'DISPLAYNAME';

/**
 * Creates a length validation decorator using our standardized field lengths
 * @param field The field to validate (must match a key in FieldLengths)
 * @param validationOptions Additional validation options
 */
export function IsStandardLength(
    field: FieldKey,
    validationOptions?: ValidationOptions
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isStandardLength',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [field],
            options: {
                message: FieldLengths.getMessage(field, 'length'),
                ...validationOptions
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [fieldKey] = args.constraints as [FieldKey];
                    const constraint = FieldLengths[fieldKey];
                    
                    if (typeof value !== 'string') return false;
                    const length = value.length;
                    return length >= constraint.MIN && length <= constraint.MAX;
                }
            }
        });
    };
}

/**
 * Combines common validation decorators for name fields
 * Includes:
 * - Standard length validation
 * - Required field validation
 * - String type validation
 */
export function IsStandardName(
    field: NameFieldKey,
    validationOptions?: ValidationOptions
) {
    return function (object: Object, propertyName: string) {
        IsStandardLength(field, validationOptions)(object, propertyName);
        // Additional standard name validations can be added here
        // For example, character set restrictions, pattern matching, etc.
    };
} 
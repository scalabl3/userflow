import { QueryRunner, TableColumnOptions, TableForeignKeyOptions } from 'typeorm';

export const isSqlite = (queryRunner: QueryRunner): boolean => 
    queryRunner.connection.options.type === 'sqlite';

export const getIdColumn = (queryRunner: QueryRunner): TableColumnOptions => {
    const sqlite = isSqlite(queryRunner);
    return {
        name: 'id',
        type: sqlite ? 'varchar' : 'uuid',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'uuid',
        default: sqlite 
            ? 'LOWER(HEX(RANDOMBLOB(4))) || \'-\' || LOWER(HEX(RANDOMBLOB(2))) || \'-4\' || SUBSTR(LOWER(HEX(RANDOMBLOB(2))),2) || \'-\' || SUBSTR(\'89AB\',ABS(RANDOM()) % 4 + 1, 1) || SUBSTR(LOWER(HEX(RANDOMBLOB(2))),2) || \'-\' || LOWER(HEX(RANDOMBLOB(6)))'
            : 'uuid_generate_v4()'
    };
};

/**
 * Creates a foreign key column and its constraint configuration.
 * 
 * @param columnName - Name of the foreign key column (e.g., 'organizationId')
 * @param referencedTableName - Name of the referenced table (e.g., 'organization')
 * @param isNullable - Whether the foreign key can be null
 * @param onDelete - Deletion behavior:
 *   - 'RESTRICT': Prevents deletion of the referenced record if this record exists (safest default)
 *   - 'CASCADE': Automatically deletes this record when the referenced record is deleted
 *   - 'SET NULL': Sets this column to null when the referenced record is deleted (requires isNullable: true)
 * 
 * Common patterns:
 * - Child records that can't exist without parent: use CASCADE (e.g., LoginCredential -> BaseUser)
 * - Core entity relationships: use RESTRICT (e.g., LoginCredential -> LoginProvider)
 * - Optional relationships: use SET NULL (requires isNullable: true)
 * 
 * Note: Consider using soft deletion pattern instead of CASCADE if historical data is important.
 * 
 * @returns Object containing both column and foreign key configurations
 */
export interface ForeignKeyConfig {
    column: TableColumnOptions;
    constraint: TableForeignKeyOptions;
}

export const getForeignKeyColumn = (
    columnName: string,
    referencedTableName: string,
    isNullable = false,
    onDelete: 'CASCADE' | 'RESTRICT' | 'SET NULL' = 'RESTRICT'
): ForeignKeyConfig => {
    if (onDelete === 'SET NULL' && !isNullable) {
        throw new Error(`Foreign key column ${columnName} must be nullable to use SET NULL onDelete behavior`);
    }
    
    return {
        column: {
            name: columnName,
            type: 'uuid',
            isNullable
        },
        constraint: {
            columnNames: [columnName],
            referencedTableName,
            referencedColumnNames: ['id'],
            onDelete
        }
    };
};

export const getTimestampColumns = (queryRunner: QueryRunner): TableColumnOptions[] => {
    const sqlite = isSqlite(queryRunner);
    return [
        {
            name: 'createdAt',
            type: sqlite ? 'datetime' : 'timestamp',
            default: sqlite ? 'DATETIME(\'now\')' : 'CURRENT_TIMESTAMP',
            isNullable: false
        },
        {
            name: 'modifiedAt',
            type: sqlite ? 'datetime' : 'timestamp',
            default: sqlite ? 'DATETIME(\'now\')' : 'CURRENT_TIMESTAMP',
            isNullable: false
        }
    ];
};

/**
 * Creates a soft deletion column for entities that need to preserve historical data.
 * 
 * When using soft deletion:
 * 1. Add this column to the entity
 * 2. Use @DeleteDateColumn in the model
 * 3. Enable TypeORM's soft delete option in the entity
 * 4. Consider adding an index on deletedAt for query performance
 * 5. Update unique constraints to account for soft-deleted records
 * 
 * Example model usage:
 * ```typescript
 * @Entity()
 * @SoftDelete()
 * export class MyEntity {
 *   @DeleteDateColumn({ type: 'datetime', nullable: true })
 *   deletedAt?: Date;
 * }
 * ```
 * 
 * Note: When using soft delete with relationships:
 * - Consider using SET NULL instead of CASCADE for related records
 * - Ensure queries properly filter soft-deleted records
 * - Be cautious with unique constraints spanning relationships
 */
export const getSoftDeletionColumn = (queryRunner: QueryRunner): TableColumnOptions => {
    const sqlite = isSqlite(queryRunner);
    return {
        name: 'deletedAt',
        type: sqlite ? 'datetime' : 'timestamp',
        isNullable: true
    };
};

export const getEnumColumn = <T extends string>(
    columnName: string,
    enumValues: T[],
    isNullable = false
): TableColumnOptions => {
    return {
        name: columnName,
        type: 'varchar',
        isNullable
    };
};

/**
 * Creates a JSON column with database-specific handling.
 * 
 * @param columnName - Name of the JSON column
 * @param isNullable - Whether the column can be null
 * @param defaultValue - Optional default value as a JSON object
 * 
 * Note: JSON handling differs between databases:
 * - Postgres: Uses native JSONB type with efficient querying and indexing
 * - SQLite: Stores as TEXT and parses on read
 * 
 * Consider:
 * 1. Avoid complex queries into JSON fields in SQLite
 * 2. Keep JSON structures simple and flat when possible
 * 3. Use proper validation at the model level
 */
export const getJsonColumn = (
    queryRunner: QueryRunner,
    columnName: string,
    isNullable = false,
    defaultValue?: Record<string, any>
): TableColumnOptions => {
    const sqlite = isSqlite(queryRunner);
    return {
        name: columnName,
        type: sqlite ? 'simple-json' : 'jsonb',  // TypeORM handles the conversion
        isNullable,
        default: defaultValue ? JSON.stringify(defaultValue) : undefined
    };
};

/**
 * Helper functions for standardized relationship declarations
 */

export interface RelationshipConfig {
    column: TableColumnOptions;
    constraint: TableForeignKeyOptions;
    index?: boolean;  // Whether to create an index on the foreign key
}

/**
 * Creates a Many-to-One relationship configuration.
 * Use this for relationships where many child records relate to one parent.
 * 
 * @param columnName - Name of the foreign key column (e.g., 'organizationId')
 * @param referencedTableName - Name of the referenced table (e.g., 'organization')
 * @param required - Whether the relationship is required (false = nullable)
 * @param onDelete - Deletion behavior (defaults to RESTRICT for required, SET NULL for optional)
 */
export const getManyToOneRelation = (
    columnName: string,
    referencedTableName: string,
    required: boolean,
    onDelete?: 'CASCADE' | 'RESTRICT' | 'SET NULL'
): RelationshipConfig => {
    // Default onDelete behavior based on whether relationship is required
    const defaultOnDelete = required ? 'RESTRICT' : 'SET NULL';
    
    return {
        column: {
            name: columnName,
            type: 'uuid',
            isNullable: !required
        },
        constraint: {
            columnNames: [columnName],
            referencedTableName,
            referencedColumnNames: ['id'],
            onDelete: onDelete || defaultOnDelete
        },
        index: true  // Always index foreign keys
    };
};

/**
 * Creates a One-to-One relationship configuration.
 * Use this for exclusive relationships between two entities.
 * 
 * @param columnName - Name of the foreign key column
 * @param referencedTableName - Name of the referenced table
 * @param required - Whether the relationship is required
 * @param unique - Whether to enforce uniqueness (true for true 1:1)
 * @param onDelete - Deletion behavior (defaults to RESTRICT)
 */
export const getOneToOneRelation = (
    columnName: string,
    referencedTableName: string,
    required: boolean,
    unique = true,
    onDelete: 'CASCADE' | 'RESTRICT' | 'SET NULL' = 'RESTRICT'
): RelationshipConfig => {
    return {
        column: {
            name: columnName,
            type: 'uuid',
            isNullable: !required,
            isUnique: unique
        },
        constraint: {
            columnNames: [columnName],
            referencedTableName,
            referencedColumnNames: ['id'],
            onDelete
        },
        index: true
    };
};

/**
 * Model decorator configuration for relationships
 */
export interface ModelRelationConfig {
    columnOptions: {
        type: 'uuid';
        nullable: boolean;
    };
    relationOptions: {
        nullable: boolean;
        onDelete: 'CASCADE' | 'RESTRICT' | 'SET NULL';
    };
}

/**
 * Creates configuration for model relationship decorators.
 * Use this in entity models to ensure consistency with migration configurations.
 * 
 * @param required - Whether the relationship is required
 * @param onDelete - Deletion behavior
 */
export const getModelRelationConfig = (
    required: boolean,
    onDelete?: 'CASCADE' | 'RESTRICT' | 'SET NULL'
): ModelRelationConfig => {
    const defaultOnDelete = required ? 'RESTRICT' : 'SET NULL';
    
    return {
        columnOptions: {
            type: 'uuid',
            nullable: !required
        },
        relationOptions: {
            nullable: !required,
            onDelete: onDelete || defaultOnDelete
        }
    };
};
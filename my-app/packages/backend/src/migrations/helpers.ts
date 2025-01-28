import { QueryRunner, TableColumnOptions } from 'typeorm';

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

export const getEnumColumn = <T extends string>(
    queryRunner: QueryRunner,
    columnName: string,
    enumValues: T[],
    isNullable = false
): TableColumnOptions => {
    const sqlite = isSqlite(queryRunner);
    return {
        name: columnName,
        type: sqlite ? 'varchar' : 'enum',
        enum: sqlite ? undefined : enumValues,
        isNullable
    };
};

export const createEnumCheck = async (
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
    enumValues: string[]
): Promise<void> => {
    if (isSqlite(queryRunner)) {
        await queryRunner.query(
            `CREATE TRIGGER ${tableName}_${columnName}_check
             BEFORE INSERT ON ${tableName}
             BEGIN
                 SELECT CASE
                     WHEN NEW.${columnName} NOT IN (${enumValues.map(v => `'${v}'`).join(',')})
                     THEN RAISE (ABORT, 'Invalid ${columnName} value')
                 END;
             END;`
        );
    }
};

export const dropEnumCheck = async (
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string
): Promise<void> => {
    if (isSqlite(queryRunner)) {
        await queryRunner.query(`DROP TRIGGER IF EXISTS ${tableName}_${columnName}_check`);
    }
}; 
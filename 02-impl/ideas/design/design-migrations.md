## Migration File Naming Convention
- For new entities: `<timestamp>-<order>-CREATE-<EntityPascalCase>.ts`
- For existing entities: `<timestamp>-<order>-ALTER-<OwnerEntityPascalCase>-WITH-<EntityPascalCase>.ts`
- For adding foreign key to entity: `<timestamp>-<order>-ADD-<EntityPascalCase>-<FK>-<TargetEntityPascalCase>.ts`

## Migration Class Naming Convention
- For new entities: `Create_${EntityPascalCase}_${timestamp}_${order}`
- For existing entities: `Alter_${OwnerEntityPascalCase}_With_${EntityPascalCase}_${timestamp}_${order}`
- For adding foreign key to entity: `Add_${EntityPascalCase}_FK_${TargetEntityPascalCase}_${timestamp}_${order}`


Migration (`my-app/packages/backend/src/migrations/<migration filename>`)
   - Table creation with proper constraints
   - Foreign key setup
   - Indices including relationship indices
   - Up and down methods

   #### Migration Structure
Required Imports:
```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
```

Key Points:
- Follow established naming convention
- Create base table first, foreign keys in separate migration
- Add appropriate indices for local fields
- Include both up and down methods
- Use transactions where appropriate
- Follow consistent column naming
- Handle default values appropriately

Example Migration Patterns:

1. Create Base Table:
```typescript
export class Create_Example_1737964200_001000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'example',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'owner_id',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '1000',
                        isNullable: true
                    },
                    {
                        name: 'is_enabled',
                        type: 'boolean',
                        default: true,
                        isNullable: false
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false
                    },
                    {
                        name: 'modified_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                        isNullable: false
                    }
                ]
            }),
            true
        );

        // Create index for the name field
        await queryRunner.createIndex(
            'example',
            new TableIndex({
                name: 'IDX_example_name',
                columnNames: ['name']
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('example', 'IDX_example_name');
        await queryRunner.dropTable('example');
    }
}

2. Add Foreign Key Relationship:

import { MigrationInterface, QueryRunner, TableIndex, TableForeignKey } from 'typeorm';

export class Add_Example_FK_Owner_1737964200_001100 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create index for the foreign key
        await queryRunner.createIndex(
            'example',
            new TableIndex({
                name: 'IDX_example_owner_id',
                columnNames: ['owner_id']
            })
        );

        // Add foreign key constraint
        await queryRunner.createForeignKey(
            'example',
            new TableForeignKey({
                name: 'FK_example_owner',
                columnNames: ['owner_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'owner',
                onDelete: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('example', 'FK_example_owner');
        await queryRunner.dropIndex('example', 'IDX_example_owner_id');
    }
}


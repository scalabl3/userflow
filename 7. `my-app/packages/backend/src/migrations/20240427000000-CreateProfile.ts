import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProfile20240427000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'profile',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'bio',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'avatarUrl',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'socialLinks',
                        type: 'simple-json',
                        isNullable: true,
                    },
                    {
                        name: 'privacyLevel',
                        type: 'enum',
                        enum: ['PUBLIC', 'PRIVATE', 'CONTACTS_ONLY'],
                        default: `'PUBLIC'`,
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                        isUnique: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'modifiedAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'profile',
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('profile');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('profile', foreignKey);
        }
        await queryRunner.dropTable('profile');
    }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { UserState } from '@my-app/shared';
import { getIdColumn, getTimestampColumns, getEnumColumn, createEnumCheck, dropEnumCheck } from './helpers';

export class CreateBaseUser1737964200004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'base_user',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'firstname',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'lastname',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'contactEmail',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    getEnumColumn(queryRunner, 'state', Object.values(UserState), false),
                    {
                        name: 'primaryLoginCredentialId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'lastLoginAt',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    ...getTimestampColumns(queryRunner)
                ],
            }),
            true
        );

        await createEnumCheck(queryRunner, 'base_user', 'state', Object.values(UserState));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await dropEnumCheck(queryRunner, 'base_user', 'state');
        await queryRunner.dropTable('base_user');
    }
}

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { BillingProviderType } from '@my-app/shared/dist/enums/BillingProviderType';
import { getIdColumn, getTimestampColumns, getEnumColumn, createEnumCheck, dropEnumCheck } from './helpers';

export class CreateBillingProvider1738084609009 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'billing_provider',
                columns: [
                    getIdColumn(queryRunner),
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
                    },
                    getEnumColumn(queryRunner, 'type', Object.values(BillingProviderType), false),
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        default: true,
                        isNullable: false
                    },
                    {
                        name: 'visible',
                        type: 'boolean',
                        default: true,
                        isNullable: false
                    },
                    ...getTimestampColumns(queryRunner)
                ],
                indices: [
                    new TableIndex({
                        name: 'IDX_BILLING_PROVIDER_NAME',
                        columnNames: ['name'],
                        isUnique: true
                    })
                ]
            }),
            true
        );

        await createEnumCheck(
            queryRunner,
            'billing_provider',
            'type',
            Object.values(BillingProviderType)
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await dropEnumCheck(queryRunner, 'billing_provider', 'type');
        await queryRunner.dropTable('billing_provider');
    }
}

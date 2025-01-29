import { Expose } from 'class-transformer';

export class ResponseLoginProviderDto {
    @Expose()
    id!: string;

    @Expose()
    code!: string;

    @Expose()
    name!: string;

    @Expose()
    isEnabled!: boolean;

    @Expose()
    createdAt!: Date;

    @Expose()
    modifiedAt!: Date;
}

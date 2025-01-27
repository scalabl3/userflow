import { DataSource } from 'typeorm';
import { Organization } from './models/Organization';
import { OrganizationRepository } from './repositories/OrganizationRepository';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const isSqlite = process.env.DATABASE_TYPE === 'sqlite';

export const AppDataSource = new DataSource({
  type: isSqlite ? 'sqlite' : 'postgres',
  database: isSqlite ? process.env.DATABASE_NAME : undefined,
  host: !isSqlite ? process.env.DATABASE_HOST : undefined,
  port: !isSqlite ? parseInt(process.env.DATABASE_PORT || '5432', 10) : undefined,
  username: !isSqlite ? process.env.DATABASE_USERNAME : undefined,
  password: !isSqlite ? process.env.DATABASE_PASSWORD : undefined,
  entities: [Organization],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
});

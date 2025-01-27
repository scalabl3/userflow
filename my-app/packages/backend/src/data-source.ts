import { DataSource, DataSourceOptions } from 'typeorm';
import { Organization } from './models/Organization';
import { LoginProvider } from './models/LoginProvider';
import { LoginCredential } from './models/LoginCredential';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const isSqlite = process.env.DATABASE_TYPE === 'sqlite';

const sqliteConfig: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DATABASE_NAME || ':memory:',
  entities: [Organization, LoginProvider, LoginCredential],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
};

const postgresConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'my_app',
  entities: [Organization, LoginProvider, LoginCredential],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
};

export const AppDataSource = new DataSource(isSqlite ? sqliteConfig : postgresConfig);

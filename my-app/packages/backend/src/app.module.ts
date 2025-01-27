import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationModule } from './modules/OrganizationModule';
import { AppDataSource } from './data-source';
import { LoginProviderModule } from './modules/LoginProviderModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    OrganizationModule,
    LoginProviderModule,
  ],
})
export class AppModule {}

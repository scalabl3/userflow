import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationModule } from './modules/OrganizationModule';
import { AppDataSource } from './data-source';
import { BaseUserModule } from './modules/BaseUserModule';
import { LoginCredentialModule } from './modules/LoginCredentialModule';
import { LoginProviderModule } from './modules/LoginProviderModule';
import { UserModule } from './modules/UserModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    OrganizationModule,
    LoginProviderModule,
    LoginCredentialModule,
    BaseUserModule,
    UserModule,
  ],
})
export class AppModule {}

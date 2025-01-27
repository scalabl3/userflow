import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationModule } from './controllers/OrganizationController';
import { OrganizationRepository } from './repositories/OrganizationRepository';
import { OrganizationService } from './services/OrganizationService';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbType = configService.get<string>('DATABASE_TYPE');
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite',
            database: configService.get<string>('DATABASE_NAME'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
            logging: configService.get<boolean>('DATABASE_LOGGING'),
          };
        } else if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get<string>('DATABASE_HOST'),
            port: configService.get<number>('DATABASE_PORT'),
            username: configService.get<string>('DATABASE_USERNAME'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
            logging: configService.get<boolean>('DATABASE_LOGGING'),
          };
        } else {
          throw new Error('Unsupported DATABASE_TYPE');
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([OrganizationRepository]),
    OrganizationModule,
  ],
  controllers: [OrganizationModule],
  providers: [OrganizationService],
})
export class AppModule {}

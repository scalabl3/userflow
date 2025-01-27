import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { OrganizationController } from '../controllers/OrganizationController';
import { OrganizationService } from '../services/OrganizationService';

@Module({
    imports: [TypeOrmModule.forFeature([Organization, User])],
    controllers: [OrganizationController],
    providers: [OrganizationService],
    exports: [OrganizationService],
})
export class OrganizationModule {} 
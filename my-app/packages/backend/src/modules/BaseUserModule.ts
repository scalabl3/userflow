import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseUser } from '../models/BaseUser';
import { BaseUserService } from '../services/BaseUserService';
import { BaseUserController } from '../controllers/BaseUserController';

@Module({
    imports: [TypeOrmModule.forFeature([BaseUser])],
    controllers: [BaseUserController],
    providers: [BaseUserService],
    exports: [BaseUserService],
})
export class BaseUserModule {}

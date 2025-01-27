import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginProvider } from '../models/LoginProvider';
import { LoginProviderController } from '../controllers/LoginProviderController';
import { LoginProviderService } from '../services/LoginProviderService';

@Module({
    imports: [TypeOrmModule.forFeature([LoginProvider])],
    controllers: [LoginProviderController],
    providers: [LoginProviderService],
    exports: [LoginProviderService],
})
export class LoginProviderModule {}

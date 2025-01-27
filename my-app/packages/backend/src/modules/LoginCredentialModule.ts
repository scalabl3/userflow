import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginCredentialService } from '../services/LoginCredentialService';
import { LoginCredentialController } from '../controllers/LoginCredentialController';
import { LoginCredential } from '../models/LoginCredential';

@Module({
    imports: [TypeOrmModule.forFeature([LoginCredential])],
    controllers: [LoginCredentialController],
    providers: [LoginCredentialService],
})
export class LoginCredentialModule {}

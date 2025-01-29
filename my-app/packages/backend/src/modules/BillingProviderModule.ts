import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingProvider } from '../models/BillingProvider';
import { BillingProviderController } from '../controllers/BillingProviderController';
import { BillingProviderService } from '../services/BillingProviderService';

@Module({
    imports: [
        TypeOrmModule.forFeature([BillingProvider])
    ],
    controllers: [BillingProviderController],
    providers: [BillingProviderService],
    exports: [BillingProviderService]
})
export class BillingProviderModule {} 
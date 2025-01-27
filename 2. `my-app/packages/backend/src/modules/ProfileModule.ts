import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../models/Profile';
import { ProfileService } from '../services/ProfileService';
import { ProfileController } from '../controllers/ProfileController';

@Module({
    imports: [TypeOrmModule.forFeature([Profile])],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule {}

# Entity Generation Guide - Part 2: Service, Update DTO, Service Tests (SDT)

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer focused on building robust service layers with comprehensive test coverage. Your role in this second phase is to generate the service implementation, update DTO, and service tests for the BillingProvider entity. Focus on proper error handling, transaction management, and thorough testing. Avoid speculation or overgeneration.

### Service Layer Specification
BillingProviderService manages payment provider configurations:
- CRUD operations for billing providers
- Provider state management (enable/disable)
- Visibility control
- Provider type validation
- Unique name enforcement
- Error handling for invalid operations

Key Operations:
- Create new billing provider
- Update existing provider
- Find provider by ID
- List all providers
- Enable/disable provider
- Set provider visibility
- Delete provider (with safety checks)

### Files to Generate

1. Service (`my-app/packages/backend/src/services/BillingProviderService.ts`)
   - Service class with dependency injection
   - CRUD operations
   - Transaction management
   - Error handling
   - Logging

2. Update DTO (`my-app/packages/shared/src/dtos/BillingProvider/UpdateBillingProviderDto.ts`)
   - Partial update support
   - Validation rules
   - OpenAPI documentation

3. Service Tests (`my-app/packages/backend/src/services/BillingProviderService.spec.ts`)
   - Unit tests for all operations
   - Error case coverage
   - Transaction rollback tests
   - Mock repository setup

### Verification Checklist
- [ ] Service follows dependency injection pattern
- [ ] Proper error handling for all operations
- [ ] Transaction management for critical operations
- [ ] Comprehensive logging
- [ ] Update DTO supports partial updates
- [ ] Update validation rules are correct
- [ ] Test coverage for success cases
- [ ] Test coverage for error cases
- [ ] Mock repository properly configured
- [ ] All imports properly organized

### File Generation Guidelines

#### Service Guidelines
- Use dependency injection
- Implement proper error handling
- Use transactions for critical operations
- Add comprehensive logging
- Follow existing service patterns
- Include method documentation
- Handle edge cases properly

#### Update DTO Guidelines
- Support partial updates
- Include proper validation
- Add comprehensive OpenAPI docs
- Follow existing DTO patterns
- Include proper examples

#### Test Guidelines
- Cover all service methods
- Test error conditions
- Use proper mocking
- Follow existing test patterns
- Include edge cases
- Test transaction rollback

### Generic Stubs

#### Service Stub
```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingProvider } from '../models/BillingProvider';
import { CreateBillingProviderDto } from '../dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '../dtos/BillingProvider/UpdateBillingProviderDto';

@Injectable()
export class BillingProviderService {
    private readonly logger = new Logger(BillingProviderService.name);

    constructor(
        @InjectRepository(BillingProvider)
        private readonly billingProviderRepository: Repository<BillingProvider>,
    ) {}

    async create(dto: CreateBillingProviderDto): Promise<BillingProvider> {
        this.logger.log(`Creating billing provider with name: ${dto.name}`);
        
        const provider = this.billingProviderRepository.create(dto);
        return await this.billingProviderRepository.save(provider);
    }

    async findById(id: string): Promise<BillingProvider> {
        const provider = await this.billingProviderRepository.findOne({ where: { id } });
        if (!provider) {
            throw new NotFoundException(`Billing provider with ID ${id} not found`);
        }
        return provider;
    }

    async findAll(): Promise<BillingProvider[]> {
        return await this.billingProviderRepository.find();
    }

    async update(id: string, dto: UpdateBillingProviderDto): Promise<BillingProvider> {
        this.logger.log(`Updating billing provider with ID: ${id}`);
        
        const provider = await this.findById(id);
        Object.assign(provider, dto);
        return await this.billingProviderRepository.save(provider);
    }

    async delete(id: string): Promise<void> {
        this.logger.log(`Deleting billing provider with ID: ${id}`);
        
        const provider = await this.findById(id);
        await this.billingProviderRepository.remove(provider);
    }

    async setEnabled(id: string, isEnabled: boolean): Promise<BillingProvider> {
        this.logger.log(`Setting enabled state to ${isEnabled} for provider ID: ${id}`);
        
        const provider = await this.findById(id);
        provider.isEnabled = isEnabled;
        return await this.billingProviderRepository.save(provider);
    }

    async setVisible(id: string, isVisible: boolean): Promise<BillingProvider> {
        this.logger.log(`Setting visibility to ${isVisible} for provider ID: ${id}`);
        
        const provider = await this.findById(id);
        provider.isVisible = isVisible;
        return await this.billingProviderRepository.save(provider);
    }
}
```

#### Update DTO Stub
```typescript
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingProviderType } from '../../models/BillingProvider';

export class UpdateBillingProviderDto {
    @ApiProperty({
        description: 'The name of the billing provider',
        example: 'Stripe',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'The type of billing provider',
        enum: BillingProviderType,
        example: BillingProviderType.STRIPE,
        required: false,
    })
    @IsOptional()
    @IsEnum(BillingProviderType)
    providerType?: BillingProviderType;

    @ApiProperty({
        description: 'Whether the provider is enabled',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;

    @ApiProperty({
        description: 'Whether the provider is visible to users',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;

    @ApiProperty({
        description: 'Description of the billing provider',
        example: 'Stripe payment processing service',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
```

#### Service Test Stub
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BillingProviderService } from './BillingProviderService';
import { BillingProvider, BillingProviderType } from '../models/BillingProvider';
import { CreateBillingProviderDto } from '../dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '../dtos/BillingProvider/UpdateBillingProviderDto';

describe('BillingProviderService', () => {
    let service: BillingProviderService;
    let repository: Repository<BillingProvider>;

    const mockProvider: BillingProvider = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Provider',
        providerType: BillingProviderType.STRIPE,
        isEnabled: false,
        isVisible: false,
        description: 'Test Description',
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BillingProviderService,
                {
                    provide: getRepositoryToken(BillingProvider),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<BillingProviderService>(BillingProviderService);
        repository = module.get<Repository<BillingProvider>>(getRepositoryToken(BillingProvider));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new billing provider', async () => {
            const dto: CreateBillingProviderDto = {
                name: 'New Provider',
                providerType: BillingProviderType.STRIPE,
            };

            jest.spyOn(repository, 'create').mockReturnValue(mockProvider);
            jest.spyOn(repository, 'save').mockResolvedValue(mockProvider);

            const result = await service.create(dto);
            expect(result).toEqual(mockProvider);
        });
    });

    describe('findById', () => {
        it('should find a billing provider by id', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockProvider);

            const result = await service.findById(mockProvider.id);
            expect(result).toEqual(mockProvider);
        });

        it('should throw NotFoundException when provider not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a billing provider', async () => {
            const dto: UpdateBillingProviderDto = {
                name: 'Updated Provider',
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockProvider);
            jest.spyOn(repository, 'save').mockResolvedValue({ ...mockProvider, ...dto });

            const result = await service.update(mockProvider.id, dto);
            expect(result.name).toBe(dto.name);
        });
    });

    describe('setEnabled', () => {
        it('should update provider enabled state', async () => {
            const updatedProvider = { ...mockProvider, isEnabled: true };
            
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockProvider);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedProvider);

            const result = await service.setEnabled(mockProvider.id, true);
            expect(result.isEnabled).toBe(true);
        });
    });

    describe('setVisible', () => {
        it('should update provider visibility', async () => {
            const updatedProvider = { ...mockProvider, isVisible: true };
            
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockProvider);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedProvider);

            const result = await service.setVisible(mockProvider.id, true);
            expect(result.isVisible).toBe(true);
        });
    });
});
``` 
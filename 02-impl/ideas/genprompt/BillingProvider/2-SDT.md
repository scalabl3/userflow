# BillingProvider Generation - Phase 2: SDT

## Aider Command Line
```bash
gouserflow && rm -rf .aider.tags.cache.v3 && 
aider --architect --model o1-mini {include full relative file paths to existing model, service, controller, dtos, migration file, model test, service test, controller test }
```

## Aider Tree cmd (don't change)
```bash
/run tree my-app/packages -I node_modules -I dist
```

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this second phase is to generate the service layer, update DTOs, and comprehensive service tests. Focus on business logic, data integrity, and proper error handling. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Entity Specification
BillingProvider service layer handles:
- CRUD operations for billing providers
- Provider configuration validation
- Credential encryption/decryption
- Provider status management

Required Features:
- Secure credential handling
- Configuration validation
- Provider type-specific validation
- Enable/disable functionality
- Provider status checks

### Files to Generate

1. Service (`my-app/packages/backend/src/services/BillingProviderService.ts`)
   - CRUD operations
   - Business logic methods
   - Error handling
   - Transaction handling

2. DTOs (`my-app/packages/shared/src/dtos/BillingProvider/`)
   - UpdateBillingProviderDto.ts

3. Tests (`my-app/packages/backend/src/services/BillingProvider.spec.ts`)
   - CRUD operation tests
   - Business logic tests
   - Error handling tests

### Verification Checklist
- [ ] Service implements proper error handling
- [ ] Service includes specialized business methods
- [ ] Proper transaction handling implemented
- [ ] Logging properly implemented
- [ ] Update DTO extends Partial<CreateDTO>
- [ ] Update DTO has proper validation
- [ ] Tests cover all service methods
- [ ] Tests include error cases
- [ ] Tests use proper mocking
- [ ] Tests handle transactions correctly

### File Generation Guidelines

#### Service Guidelines
- Implement proper error handling for unique constraints
- Include specialized methods (enable/disable, validate)
- Implement credential encryption
- Use TypeORM transactions where needed
- Implement proper logging
- Include configuration validation
- Use TypeORM query builder for complex queries
- Implement provider-specific validation

#### Update DTO Guidelines
- Extend Partial<CreateDTO>
- Include validation for partial updates
- Include comprehensive OpenAPI docs
- Handle nested object updates properly
- Include proper validation messages

#### Service Test Guidelines
- Create test data factories
- Implement proper mocks
- Cover edge cases
- Handle test transactions
- Test error scenarios
- Test business logic thoroughly
- Implement proper cleanup
- Use test database
- Mock external services

### Update DTO Stub
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateBillingProviderDto } from './CreateBillingProviderDto';

export class UpdateBillingProviderDto extends PartialType(CreateBillingProviderDto) {}
```

### Service Stub
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BillingProvider } from '../models/BillingProvider';
import { CreateBillingProviderDto, UpdateBillingProviderDto, ResponseBillingProviderDto } from '@my-app/shared';
import { plainToInstance } from 'class-transformer';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../services/EncryptionService';

@Injectable()
export class BillingProviderService {
    private readonly logger = new Logger(BillingProviderService.name);

    constructor(
        @InjectRepository(BillingProvider)
        private readonly repository: Repository<BillingProvider>,
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService,
    ) {}

    async create(dto: CreateBillingProviderDto): Promise<ResponseBillingProviderDto> {
        this.logger.debug(`Creating BillingProvider with data: ${JSON.stringify(dto)}`);
        
        const entity = this.repository.create(dto);
        
        if (dto.credentials) {
            entity.credentials = await this.encryptionService.encrypt(dto.credentials);
        }
        
        try {
            const saved = await this.repository.save(entity);
            return plainToInstance(ResponseBillingProviderDto, saved, { excludeExtraneousValues: true });
        } catch (error) {
            if (error instanceof QueryFailedError) {
                this.logger.error(`Failed to create BillingProvider: ${error.message}`);
                throw new Error('Failed to create BillingProvider due to constraint violation');
            }
            throw error;
        }
    }

    async findById(id: string): Promise<ResponseBillingProviderDto> {
        this.logger.debug(`Finding BillingProvider by id: ${id}`);
        
        const entity = await this.repository.findOne({ where: { id } });
        
        if (!entity) {
            throw new EntityNotFoundError(BillingProvider, `BillingProvider with id ${id} not found`);
        }
        
        return plainToInstance(ResponseBillingProviderDto, entity, { excludeExtraneousValues: true });
    }

    async update(id: string, dto: UpdateBillingProviderDto): Promise<ResponseBillingProviderDto> {
        this.logger.debug(`Updating BillingProvider ${id} with data: ${JSON.stringify(dto)}`);
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const entity = await queryRunner.manager.findOne(BillingProvider, { where: { id } });
            
            if (!entity) {
                throw new EntityNotFoundError(BillingProvider, `BillingProvider with id ${id} not found`);
            }
            
            if (dto.credentials) {
                dto.credentials = await this.encryptionService.encrypt(dto.credentials);
            }
            
            Object.assign(entity, dto);
            const updated = await queryRunner.manager.save(entity);
            
            await queryRunner.commitTransaction();
            return plainToInstance(ResponseBillingProviderDto, updated, { excludeExtraneousValues: true });
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof QueryFailedError) {
                this.logger.error(`Failed to update BillingProvider: ${error.message}`);
                throw new Error('Failed to update BillingProvider due to constraint violation');
            }
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: string): Promise<void> {
        this.logger.debug(`Deleting BillingProvider with id: ${id}`);
        
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            throw new EntityNotFoundError(BillingProvider, `BillingProvider with id ${id} not found`);
        }
    }

    async findAll(): Promise<ResponseBillingProviderDto[]> {
        this.logger.debug('Finding all BillingProviders');
        
        const entities = await this.repository.find();
        
        return entities.map(entity => 
            plainToInstance(ResponseBillingProviderDto, entity, { excludeExtraneousValues: true })
        );
    }

    async enable(id: string): Promise<ResponseBillingProviderDto> {
        return this.update(id, { isEnabled: true });
    }

    async disable(id: string): Promise<ResponseBillingProviderDto> {
        return this.update(id, { isEnabled: false });
    }

    async validateConfiguration(id: string): Promise<boolean> {
        const entity = await this.repository.findOne({ where: { id } });
        
        if (!entity) {
            throw new EntityNotFoundError(BillingProvider, `BillingProvider with id ${id} not found`);
        }

        // Implement provider-specific validation logic here
        switch (entity.providerType) {
            case 'STRIPE':
                return this.validateStripeConfiguration(entity);
            case 'PAYPAL':
                return this.validatePayPalConfiguration(entity);
            default:
                throw new Error(`Unsupported provider type: ${entity.providerType}`);
        }
    }

    private async validateStripeConfiguration(provider: BillingProvider): Promise<boolean> {
        // Implement Stripe-specific validation
        return true;
    }

    private async validatePayPalConfiguration(provider: BillingProvider): Promise<boolean> {
        // Implement PayPal-specific validation
        return true;
    }
}
```

### Service Test Stub
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository, QueryFailedError } from 'typeorm';
import { BillingProviderService } from './BillingProviderService';
import { BillingProvider } from '../models/BillingProvider';
import { CreateBillingProviderDto, UpdateBillingProviderDto } from '@my-app/shared';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../services/EncryptionService';
import { BillingProviderType } from '../enums/BillingProviderType';

describe('BillingProviderService', () => {
    let service: BillingProviderService;
    let repository: Repository<BillingProvider>;
    let dataSource: DataSource;
    let encryptionService: EncryptionService;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
    };

    const mockDataSource = {
        createQueryRunner: jest.fn(() => ({
            connect: jest.fn(),
            startTransaction: jest.fn(),
            manager: {
                findOne: jest.fn(),
                save: jest.fn(),
            },
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
        })),
    };

    const mockConfigService = {
        get: jest.fn(),
    };

    const mockEncryptionService = {
        encrypt: jest.fn(),
        decrypt: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BillingProviderService,
                {
                    provide: getRepositoryToken(BillingProvider),
                    useValue: mockRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: EncryptionService,
                    useValue: mockEncryptionService,
                },
            ],
        }).compile();

        service = module.get<BillingProviderService>(BillingProviderService);
        repository = module.get<Repository<BillingProvider>>(getRepositoryToken(BillingProvider));
        dataSource = module.get<DataSource>(DataSource);
        encryptionService = module.get<EncryptionService>(EncryptionService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new provider successfully', async () => {
            const createDto: CreateBillingProviderDto = {
                name: 'Test Provider',
                providerType: BillingProviderType.STRIPE,
                isEnabled: true,
                credentials: { apiKey: 'test_key' },
            };

            const encryptedCredentials = { apiKey: 'encrypted_key' };
            mockEncryptionService.encrypt.mockResolvedValue(encryptedCredentials);

            const entity = new BillingProvider();
            Object.assign(entity, { ...createDto, credentials: encryptedCredentials });
            entity.id = 'test-id';

            mockRepository.create.mockReturnValue(entity);
            mockRepository.save.mockResolvedValue(entity);

            const result = await service.create(createDto);

            expect(result).toBeDefined();
            expect(result.id).toBe('test-id');
            expect(result.name).toBe(createDto.name);
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith(createDto.credentials);
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...createDto,
                credentials: encryptedCredentials,
            });
            expect(mockRepository.save).toHaveBeenCalledWith(entity);
        });

        it('should handle unique constraint violations', async () => {
            const createDto: CreateBillingProviderDto = {
                name: 'Test Provider',
                providerType: BillingProviderType.STRIPE,
                isEnabled: true,
            };

            mockRepository.create.mockReturnValue(new BillingProvider());
            mockRepository.save.mockRejectedValue(new QueryFailedError('query', [], 'unique constraint'));

            await expect(service.create(createDto)).rejects.toThrow('Failed to create BillingProvider due to constraint violation');
        });
    });

    // Additional test cases for update, delete, findById, etc.
});
``` 

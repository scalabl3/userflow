# Entity Generation Guide - Part 2: Service, update DTO, service Tests (SDT)

## Instructions for Template Creation
- Replace `<EntityName>` with BillingProvider in PascalCase
- Replace `<entityName>` with billingProvider in camelCase
- Ensure consistent casing across all files:
  - PascalCase for classes and types
  - camelCase for methods and properties
- Verify all paths and imports are correct
- Remove any unnecessary code or comments
- Keep examples minimal but clear

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer focused on building robust service layers with comprehensive test coverage. Your role in this second phase is to generate the service implementation, update DTO, and service tests. Focus on proper error handling, transaction management, and thorough testing. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Entity Specification
BillingProvider represents a payment provider supported by the system. Key aspects:
- Each provider has a unique name (e.g., Stripe, Apple Pay, Google Pay, PayPal)
- Providers can be enabled/disabled for system-wide use
- Providers can be made visible/invisible to users
- Provider type is an enum of supported providers
- Provider requires configuration and credentials (to be expanded later)
- Similar pattern to LoginProvider in terms of usage and management

### Files to Generate

1. Service (`my-app/packages/backend/src/services/BillingProviderService.ts`)
   - Service class with dependency injection
   - CRUD operations with unique name validation
   - Transaction management for provider updates
   - Error handling for duplicate names
   - Logging for provider status changes

2. Update DTO (`my-app/packages/shared/src/dtos/BillingProvider/UpdateBillingProviderDto.ts`)
   - Partial update support for provider fields
   - Validation rules for name uniqueness
   - OpenAPI documentation for provider fields

3. Service Tests (`my-app/packages/backend/src/services/BillingProviderService.spec.ts`)
   - Unit tests for all provider operations
   - Error case coverage for duplicate names
   - Transaction rollback tests
   - Mock repository setup for providers

### Verification Checklist
- [ ] Service follows dependency injection pattern
- [ ] Proper error handling for duplicate provider names
- [ ] Transaction management for provider status changes
- [ ] Comprehensive logging of provider operations
- [ ] Update DTO supports partial provider updates
- [ ] Update validation rules check name uniqueness
- [ ] Test coverage for provider success cases
- [ ] Test coverage for provider error cases
- [ ] Mock repository properly configured for providers
- [ ] All imports properly organized

### Code Structure Guidelines

#### Service Structure
Required Imports:
```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EntityName } from '../models/EntityName';
```

Key Points:
- Use dependency injection for repository
- Implement proper error handling
- Use transactions for critical operations
- Add comprehensive logging
- Follow existing service patterns
- Include method documentation
- Handle edge cases properly

Example Pattern:
```typescript
@Injectable()
export class ExampleService {
    private readonly logger = new Logger(ExampleService.name);

    constructor(
        @InjectRepository(Example)
        private readonly repository: Repository<Example>,
        private readonly dataSource: DataSource,
    ) {}

    async findById(id: string): Promise<Example> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) {
            this.logger.warn(`Entity with ID ${id} not found`);
            throw new NotFoundException(`Entity not found`);
        }
        return entity;
    }

    async update(id: string, dto: UpdateExampleDto): Promise<Example> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const entity = await this.findById(id);
            Object.assign(entity, dto);
            const result = await queryRunner.manager.save(entity);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
```

#### Update DTO Structure
Required Imports:
```typescript
import { IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExampleDto } from './CreateExampleDto';
```

Key Points:
- Extend from PartialType of Create DTO when possible
- Make all fields optional
- Keep validation rules from Create DTO
- Add comprehensive OpenAPI documentation
- Include meaningful examples
- Follow consistent naming patterns

Example Pattern:
```typescript
export class UpdateExampleDto extends PartialType(CreateExampleDto) {
    @ApiProperty({
        description: 'Optional field description',
        required: false
    })
    @IsOptional()
    optionalField?: string;
}
```

#### Service Test Structure
Required Imports:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
```

Key Points:
- Mock repository and dependencies
- Test all service methods
- Cover error scenarios
- Test transaction rollbacks
- Use proper type assertions
- Follow AAA pattern (Arrange, Act, Assert)
- Include edge cases
- Mock external services

Example Pattern:
```typescript
describe('ExampleService', () => {
    let service: ExampleService;
    let repository: Repository<Example>;
    let dataSource: DataSource;

    const mockEntity = {
        id: '123',
        name: 'Test'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExampleService,
                {
                    provide: getRepositoryToken(Example),
                    useClass: Repository
                },
                {
                    provide: DataSource,
                    useValue: {
                        createQueryRunner: jest.fn().mockReturnValue({
                            connect: jest.fn(),
                            startTransaction: jest.fn(),
                            commitTransaction: jest.fn(),
                            rollbackTransaction: jest.fn(),
                            release: jest.fn(),
                            manager: {
                                save: jest.fn()
                            }
                        })
                    }
                }
            ],
        }).compile();

        service = module.get<ExampleService>(ExampleService);
        repository = module.get<Repository<Example>>(getRepositoryToken(Example));
        dataSource = module.get<DataSource>(DataSource);
    });

    describe('update', () => {
        it('should update entity and commit transaction', async () => {
            const dto = { name: 'Updated' };
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockEntity);
            
            const result = await service.update('123', dto);
            
            expect(result).toBeDefined();
            expect(result.name).toBe(dto.name);
        });

        it('should rollback transaction on error', async () => {
            jest.spyOn(repository, 'findOne').mockRejectedValue(new Error());
            
            await expect(service.update('123', {}))
                .rejects
                .toThrow();
        });
    });
}); 
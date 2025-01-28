# Entity Generation Guide - Is-A Relationship: Service, Update DTO, Service Tests (SDT)

## Instructions for Template Creation
- Replace `<EntityName>` with the actual entity name in PascalCase
- Replace `<BaseEntityName>` with the base entity name in PascalCase
- Replace `<entityName>` with the entity name in camelCase
- Replace `<baseEntityName>` with the base entity name in camelCase
- Ensure consistent casing across all files:
  - PascalCase for classes and types
  - camelCase for methods and properties
- Verify all paths and imports are correct
- Remove any unnecessary code or comments
- Keep examples minimal but clear

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer focused on building robust service layers with comprehensive test coverage for entities with Is-A relationships. Your role in this second phase is to generate the service implementation, update DTO, and service tests. Focus on proper inheritance handling, error management, transaction management, and thorough testing. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples: 
- `EntityName` is-a `BaseEntityName`
- AdminUser is-a User
- class AdminUser extends User {}

### Files to Generate

1. Service (`my-app/packages/backend/src/services/<EntityName>Service.ts`)
   - Service class with dependency injection
   - CRUD operations with inheritance handling
   - Transaction management for inherited operations
   - Error handling for inheritance constraints
   - Logging for inheritance operations

2. Update DTO (`my-app/packages/shared/src/dtos/<EntityName>/Update<EntityName>Dto.ts`)
   - Partial update support with inheritance
   - Inherited validation rules
   - OpenAPI documentation for inheritance

3. Service Tests (`my-app/packages/backend/src/services/<EntityName>Service.spec.ts`)
   - Unit tests for all operations including inheritance
   - Error case coverage for inheritance constraints
   - Transaction rollback tests for inheritance operations
   - Mock repository setup with inheritance support

### Verification Checklist
- [ ] Service handles inheritance operations properly
- [ ] Proper error handling for inheritance constraints
- [ ] Transaction management for inheritance operations
- [ ] Comprehensive logging for inheritance changes
- [ ] Update DTO supports inherited field updates
- [ ] Update validation rules handle inheritance
- [ ] Test coverage for inheritance success cases
- [ ] Test coverage for inheritance error cases
- [ ] Mock repository properly handles inheritance
- [ ] All imports properly organized

### Code Structure Guidelines

#### Service Structure
Required Imports:
```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EntityName } from '../models/EntityName';
import { BaseEntityName } from '../models/BaseEntityName';
```

Key Points:
- Use dependency injection for repository
- Implement proper inheritance error handling
- Use transactions for inheritance operations
- Add comprehensive inheritance logging
- Follow existing service patterns
- Include method documentation
- Handle inheritance edge cases

Example Pattern:
```typescript
@Injectable()
export class ExampleService extends BaseEntityService {
    private readonly logger = new Logger(ExampleService.name);

    constructor(
        @InjectRepository(Example)
        private readonly repository: Repository<Example>,
        private readonly dataSource: DataSource,
    ) {
        super(repository);
    }

    async findById(id: string): Promise<Example> {
        const entity = await this.repository.findOne({
            where: { id }
        });
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
            
            // Handle inherited fields first
            await super.validateInheritedFields(dto);
            
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

    // Override base method with specific implementation
    override async validateBusinessRules(entity: Example): Promise<void> {
        await super.validateBusinessRules(entity);
        // Add specific validation for this entity type
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
- Extend from PartialType of Create DTO
- Include inherited field validations
- Add inheritance documentation
- Include meaningful examples
- Follow consistent naming patterns
- Handle discriminator field

Example Pattern:
```typescript
export class UpdateExampleDto extends PartialType(CreateExampleDto) {
    @ApiProperty({
        description: 'Additional field specific to this entity type',
        required: false
    })
    @IsOptional()
    additional_field?: string;

    // Inherited fields are automatically included through PartialType
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
- Mock repository with inheritance support
- Test all inherited operations
- Cover inheritance error scenarios
- Test inheritance transaction rollbacks
- Use proper inheritance assertions
- Follow AAA pattern
- Include inheritance edge cases
- Mock inherited services

Example Pattern:
```typescript
describe('ExampleService', () => {
    let service: ExampleService;
    let repository: Repository<Example>;
    let dataSource: DataSource;

    const mockEntity = {
        id: '123',
        base_field: 'Base Value',
        additional_field: 'Additional Value',
        type: 'example'
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
        it('should update entity with inherited fields and commit transaction', async () => {
            const dto = {
                base_field: 'Updated Base',
                additional_field: 'Updated Additional'
            };
            
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockEntity);
            
            const result = await service.update('123', dto);
            
            expect(result).toBeDefined();
            expect(result.base_field).toBe(dto.base_field);
            expect(result.additional_field).toBe(dto.additional_field);
        });

        it('should validate inherited fields before update', async () => {
            const dto = {
                base_field: 'Invalid Value'
            };
            
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockEntity);
            jest.spyOn(service as any, 'validateInheritedFields')
                .mockRejectedValue(new Error('Invalid base field'));
            
            await expect(service.update('123', dto))
                .rejects
                .toThrow('Invalid base field');
        });
    });
});
``` 
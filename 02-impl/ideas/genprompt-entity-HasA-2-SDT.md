# Entity Generation Guide - Has-A Relationship: Service, Update DTO, Service Tests (SDT)

## Instructions for Template Creation
- Replace `<EntityName>` with the actual entity name in PascalCase
- Replace `<OwnerEntityName>` with the owner entity name in PascalCase
- Replace `<entityName>` with the entity name in camelCase
- Replace `<ownerEntityName>` with the owner entity name in camelCase
- Ensure consistent casing across all files:
  - PascalCase for classes and types
  - camelCase for methods and properties
- Verify all paths and imports are correct
- Remove any unnecessary code or comments
- Keep examples minimal but clear


## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer focused on building robust service layers with comprehensive test coverage for entities with Has-A relationships. Your role in this second phase is to generate the service implementation, update DTO, and service tests. Focus on proper relationship handling, error management, transaction management, and thorough testing. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples: 
- `OwnerEntityName` has-a `EntityName`
- User has-a Preferences
- User.preferences = new Preferences();

### Files to Generate

1. Service (`my-app/packages/backend/src/services/<EntityName>Service.ts`)
   - Service class with dependency injection
   - CRUD operations with relationship handling
   - Transaction management for relationship operations
   - Error handling for relationship constraints
   - Logging for relationship changes

2. Update DTO (`my-app/packages/shared/src/dtos/<EntityName>/Update<EntityName>Dto.ts`)
   - Partial update support with relationship fields
   - Relationship validation rules
   - OpenAPI documentation for relationships

3. Service Tests (`my-app/packages/backend/src/services/<EntityName>Service.spec.ts`)
   - Unit tests for all operations including relationships
   - Error case coverage for relationship constraints
   - Transaction rollback tests for relationship operations
   - Mock repository setup with relationship support

### Verification Checklist
- [ ] Service handles relationship operations properly
- [ ] Proper error handling for relationship constraints
- [ ] Transaction management for relationship operations
- [ ] Comprehensive logging for relationship changes
- [ ] Update DTO supports relationship field updates
- [ ] Update validation rules handle relationships
- [ ] Test coverage for relationship success cases
- [ ] Test coverage for relationship error cases
- [ ] Mock repository properly handles relationships
- [ ] All imports properly organized

### Code Structure Guidelines

#### Service Structure
Required Imports:
```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EntityName } from '../models/EntityName';
import { OwnerEntityName } from '../models/OwnerEntityName';
```

Key Points:
- Use dependency injection for both repositories
- Implement proper relationship error handling
- Use transactions for relationship operations
- Add comprehensive relationship logging
- Follow existing service patterns
- Include method documentation
- Handle relationship edge cases

Example Pattern:
```typescript
@Injectable()
export class ExampleService {
    private readonly logger = new Logger(ExampleService.name);

    constructor(
        @InjectRepository(Example)
        private readonly repository: Repository<Example>,
        @InjectRepository(OwnerEntity)
        private readonly ownerRepository: Repository<OwnerEntity>,
        private readonly dataSource: DataSource,
    ) {}

    async findById(id: string): Promise<Example> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['owner']
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
            
            if (dto.owner_id) {
                const owner = await this.ownerRepository.findOne({
                    where: { id: dto.owner_id }
                });
                if (!owner) {
                    throw new NotFoundException(`Owner with ID ${dto.owner_id} not found`);
                }
                entity.owner = owner;
            }
            
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
import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExampleDto } from './CreateExampleDto';
```

Key Points:
- Extend from PartialType of Create DTO
- Include optional relationship fields
- Add relationship validation rules
- Add comprehensive relationship documentation
- Include meaningful relationship examples
- Follow consistent naming patterns

Example Pattern:
```typescript
export class UpdateExampleDto extends PartialType(CreateExampleDto) {
    @ApiProperty({
        description: 'The ID of the owner entity',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsOptional()
    @IsUUID()
    owner_id?: string;
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
- Mock both repositories
- Test all relationship operations
- Cover relationship error scenarios
- Test relationship transaction rollbacks
- Use proper relationship assertions
- Follow AAA pattern
- Include relationship edge cases
- Mock relationship services

Example Pattern:
```typescript
describe('ExampleService', () => {
    let service: ExampleService;
    let repository: Repository<Example>;
    let ownerRepository: Repository<OwnerEntity>;
    let dataSource: DataSource;

    const mockEntity = {
        id: '123',
        owner_id: '456',
        owner: {
            id: '456',
            name: 'Owner'
        }
    };

    const mockOwner = {
        id: '456',
        name: 'Owner'
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
                    provide: getRepositoryToken(OwnerEntity),
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
        ownerRepository = module.get<Repository<OwnerEntity>>(getRepositoryToken(OwnerEntity));
        dataSource = module.get<DataSource>(DataSource);
    });

    describe('update', () => {
        it('should update entity with new owner and commit transaction', async () => {
            const dto = { owner_id: '789' };
            const newOwner = { id: '789', name: 'New Owner' };
            
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockEntity);
            jest.spyOn(ownerRepository, 'findOne').mockResolvedValue(newOwner);
            
            const result = await service.update('123', dto);
            
            expect(result).toBeDefined();
            expect(result.owner.id).toBe(dto.owner_id);
        });

        it('should rollback transaction on owner not found', async () => {
            const dto = { owner_id: '999' };
            
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockEntity);
            jest.spyOn(ownerRepository, 'findOne').mockResolvedValue(null);
            
            await expect(service.update('123', dto))
                .rejects
                .toThrow(NotFoundException);
        });
    });
});
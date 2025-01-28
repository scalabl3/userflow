# Entity Generation Guide - Has-A Relationship - Part 2: Service, Update DTO, Service Tests (SDT)

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this second phase is to generate the service layer, update DTOs, and comprehensive service tests for an entity that has a Has-A relationship with another entity. Focus on relationship operations, data integrity, and proper error handling. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples: 
- `OwnerEntityName` has-a `EntityName`
- User has-a Preferences
- User.preferences = new Preferences();

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase (e.g., BillingCredential)
- Replace `<OwnerEntityName>` with the containing entity name in PascalCase (e.g., BillingCredentialSet)
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files
  - camelCase for properties and methods

### Entity Specification
{entity model properties goes here}

### Files to Generate

1. Service (`my-app/packages/backend/src/services/<EntityName>Service.ts`)
   - CRUD operations with relationship handling
   - Business logic methods
   - Error handling
   - Transaction handling

2. DTOs (`my-app/packages/shared/src/dtos/`)
   - Update<EntityName>Dto.ts

3. Tests (`my-app/packages/backend/src/services/<EntityName>Service.spec.ts`)
   - CRUD operation tests
   - Relationship operation tests
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
- [ ] Relationship operations are properly tested
- [ ] Owner entity relationship is properly handled

### File Generation Guidelines

#### Service Guidelines
- Implement proper error handling for unique and foreign key constraints
- Include specialized methods for relationship operations
- Use TypeORM transactions for relationship operations
- Implement proper logging
- Include relationship validation
- Use TypeORM query builder for complex relationship queries
- Implement proper owner entity validation
- Handle cascading operations appropriately

#### Update DTO Guidelines
- Extend Partial<CreateDTO>
- Include validation for partial updates
- Include comprehensive OpenAPI docs
- Handle relationship field updates properly
- Include proper validation messages

#### Service Test Guidelines
- Create test data factories for both entities
- Implement proper mocks for relationships
- Cover edge cases in relationships
- Handle test transactions
- Test error scenarios
- Test business logic thoroughly
- Test relationship operations
- Implement proper cleanup
- Use test database
- Mock external services

### Generic Stubs

#### Service Stub
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { <EntityName> } from '../models/<EntityName>';
import { <OwnerEntityName> } from '../models/<OwnerEntityName>';
import { Create<EntityName>Dto, Update<EntityName>Dto, Response<EntityName>Dto } from '@my-app/shared';
import { plainToInstance } from 'class-transformer';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Injectable()
export class <EntityName>Service {
    private readonly logger = new Logger(<EntityName>Service.name);

    constructor(
        @InjectRepository(<EntityName>)
        private readonly repository: Repository<<EntityName>>,
        @InjectRepository(<OwnerEntityName>)
        private readonly ownerRepository: Repository<<OwnerEntityName>>,
        private readonly dataSource: DataSource,
    ) {}

    async create(dto: Create<EntityName>Dto): Promise<Response<EntityName>Dto> {
        this.logger.debug(`Creating <EntityName> with data: ${JSON.stringify(dto)}`);
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const owner = await queryRunner.manager.findOne(<OwnerEntityName>, {
                where: { id: dto.ownerId }
            });
            
            if (!owner) {
                throw new EntityNotFoundError(<OwnerEntityName>, `<OwnerEntityName> with id ${dto.ownerId} not found`);
            }
            
            const entity = this.repository.create(dto);
            const saved = await queryRunner.manager.save(entity);
            
            await queryRunner.commitTransaction();
            return plainToInstance(Response<EntityName>Dto, saved, { excludeExtraneousValues: true });
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof QueryFailedError) {
                this.logger.error(`Failed to create <EntityName>: ${error.message}`);
                throw new Error('Failed to create <EntityName> due to constraint violation');
            }
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findByOwnerId(ownerId: string): Promise<Response<EntityName>Dto[]> {
        this.logger.debug(`Finding <EntityName>s by owner id: ${ownerId}`);
        
        const entities = await this.repository.find({
            where: { ownerId },
            relations: ['owner']
        });
        
        return entities.map(entity => 
            plainToInstance(Response<EntityName>Dto, entity, { excludeExtraneousValues: true })
        );
    }

    async update(id: string, dto: Update<EntityName>Dto): Promise<Response<EntityName>Dto> {
        this.logger.debug(`Updating <EntityName> ${id} with data: ${JSON.stringify(dto)}`);
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const entity = await queryRunner.manager.findOne(<EntityName>, {
                where: { id },
                relations: ['owner']
            });
            
            if (!entity) {
                throw new EntityNotFoundError(<EntityName>, `<EntityName> with id ${id} not found`);
            }
            
            if (dto.ownerId && dto.ownerId !== entity.ownerId) {
                const newOwner = await queryRunner.manager.findOne(<OwnerEntityName>, {
                    where: { id: dto.ownerId }
                });
                
                if (!newOwner) {
                    throw new EntityNotFoundError(<OwnerEntityName>, `<OwnerEntityName> with id ${dto.ownerId} not found`);
                }
            }
            
            Object.assign(entity, dto);
            const updated = await queryRunner.manager.save(entity);
            
            await queryRunner.commitTransaction();
            return plainToInstance(Response<EntityName>Dto, updated, { excludeExtraneousValues: true });
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof QueryFailedError) {
                this.logger.error(`Failed to update <EntityName>: ${error.message}`);
                throw new Error('Failed to update <EntityName> due to constraint violation');
            }
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: string): Promise<void> {
        this.logger.debug(`Deleting <EntityName> with id: ${id}`);
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const entity = await queryRunner.manager.findOne(<EntityName>, {
                where: { id }
            });
            
            if (!entity) {
                throw new EntityNotFoundError(<EntityName>, `<EntityName> with id ${id} not found`);
            }
            
            await queryRunner.manager.remove(entity);
            await queryRunner.commitTransaction();
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
```

#### Update DTO Stub
```typescript
import { PartialType } from '@nestjs/swagger';
import { Create<EntityName>Dto } from './Create<EntityName>Dto';

export class Update<EntityName>Dto extends PartialType(Create<EntityName>Dto) {}
```

#### Service Test Stub
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository, QueryFailedError } from 'typeorm';
import { <EntityName>Service } from './<EntityName>Service';
import { <EntityName> } from '../models/<EntityName>';
import { <OwnerEntityName> } from '../models/<OwnerEntityName>';
import { Create<EntityName>Dto, Update<EntityName>Dto } from '@my-app/shared';

describe('<EntityName>Service', () => {
    let service: <EntityName>Service;
    let repository: Repository<<EntityName>>;
    let ownerRepository: Repository<<OwnerEntityName>>;
    let dataSource: DataSource;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        remove: jest.fn(),
    };

    const mockOwnerRepository = {
        findOne: jest.fn(),
    };

    const mockDataSource = {
        createQueryRunner: jest.fn(() => ({
            connect: jest.fn(),
            startTransaction: jest.fn(),
            manager: {
                findOne: jest.fn(),
                save: jest.fn(),
                remove: jest.fn(),
            },
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
        })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                <EntityName>Service,
                {
                    provide: getRepositoryToken(<EntityName>),
                    useValue: mockRepository,
                },
                {
                    provide: getRepositoryToken(<OwnerEntityName>),
                    useValue: mockOwnerRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<<EntityName>Service>(<EntityName>Service);
        repository = module.get<Repository<<EntityName>>>(getRepositoryToken(<EntityName>));
        ownerRepository = module.get<Repository<<OwnerEntityName>>>(getRepositoryToken(<OwnerEntityName>));
        dataSource = module.get<DataSource>(DataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new entity with valid owner successfully', async () => {
            const ownerId = 'test-owner-id';
            const createDto: Create<EntityName>Dto = {
                name: 'Test Name',
                ownerId,
            };

            const owner = { id: ownerId };
            const entity = { id: 'test-id', ...createDto };
            
            const queryRunner = mockDataSource.createQueryRunner();
            queryRunner.manager.findOne.mockResolvedValueOnce(owner);
            queryRunner.manager.save.mockResolvedValueOnce(entity);

            const result = await service.create(createDto);

            expect(result).toBeDefined();
            expect(result.id).toBe('test-id');
            expect(result.name).toBe(createDto.name);
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(queryRunner.commitTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });

        it('should throw error when owner not found', async () => {
            const createDto: Create<EntityName>Dto = {
                name: 'Test Name',
                ownerId: 'non-existent-owner',
            };

            const queryRunner = mockDataSource.createQueryRunner();
            queryRunner.manager.findOne.mockResolvedValueOnce(null);

            await expect(service.create(createDto)).rejects.toThrow(EntityNotFoundError);
            expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });
    });

    // Additional test cases for update, delete, findByOwnerId, etc.
});
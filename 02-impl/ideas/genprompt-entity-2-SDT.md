# Entity Generation Guide - Part 2: Service, update DTO, service Tests (SDT)

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

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files
  - camelCase for properties and methods

### Entity Specification
{entity model stub goes here}

### Files to Generate

1. Service (`my-app/packages/backend/src/services/<EntityName>Service.ts`)
   - CRUD operations
   - Business logic methods
   - Error handling
   - Transaction handling

2. DTOs (`my-app/packages/shared/src/dtos/`)
   - Update<EntityName>Dto.ts

3. Tests (`my-app/packages/backend/src/services/<EntityName>Service.spec.ts`)
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
- Include specialized methods (enable/disable, visibility)
- Implement soft delete handling
- Use TypeORM transactions where needed
- Implement proper logging
- Include configuration validation
- Use TypeORM query builder for complex queries
- Implement pagination for list operations

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

### Generic Stubs

#### Service Stub
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { <EntityName> } from '../models/<EntityName>';
import { Create<EntityName>Dto } from '@my-app/shared';
import { Update<EntityName>Dto } from '@my-app/shared';
import { Response<EntityName>Dto } from '@my-app/shared';
import { plainToInstance } from 'class-transformer';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Injectable()
export class <EntityName>Service {
    private readonly logger = new Logger(<EntityName>Service.name);

    constructor(
        @InjectRepository(<EntityName>)
        private readonly repository: Repository<<EntityName>>,
        private readonly dataSource: DataSource,
    ) {}

    async create(dto: Create<EntityName>Dto): Promise<Response<EntityName>Dto> {
        this.logger.debug(`Creating <EntityName> with data: ${JSON.stringify(dto)}`);
        
        const entity = this.repository.create(dto);
        
        try {
            const saved = await this.repository.save(entity);
            return plainToInstance(Response<EntityName>Dto, saved, { excludeExtraneousValues: true });
        } catch (error) {
            if (error instanceof QueryFailedError) {
                this.logger.error(`Failed to create <EntityName>: ${error.message}`);
                throw new Error('Failed to create <EntityName> due to constraint violation');
            }
            throw error;
        }
    }

    async findById(id: string): Promise<Response<EntityName>Dto> {
        this.logger.debug(`Finding <EntityName> by id: ${id}`);
        
        const entity = await this.repository.findOne({ 
            where: { id },
            relations: ['owner']
        });
        
        if (!entity) {
            throw new EntityNotFoundError(<EntityName>, `<EntityName> with id ${id} not found`);
        }
        
        return plainToInstance(Response<EntityName>Dto, entity, { excludeExtraneousValues: true });
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
        
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            throw new EntityNotFoundError(<EntityName>, `<EntityName> with id ${id} not found`);
        }
    }

    async findAll(): Promise<Response<EntityName>Dto[]> {
        this.logger.debug('Finding all <EntityName>s');
        
        const entities = await this.repository.find({
            relations: ['owner']
        });
        
        return entities.map(entity => 
            plainToInstance(Response<EntityName>Dto, entity, { excludeExtraneousValues: true })
        );
    }

    async enable(id: string): Promise<Response<EntityName>Dto> {
        return this.update(id, { isEnabled: true });
    }

    async disable(id: string): Promise<Response<EntityName>Dto> {
        return this.update(id, { isEnabled: false });
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
import { Create<EntityName>Dto, Update<EntityName>Dto } from '@my-app/shared';

describe('<EntityName>Service', () => {
    let service: <EntityName>Service;
    let repository: Repository<<EntityName>>;
    let dataSource: DataSource;

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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                <EntityName>Service,
                {
                    provide: getRepositoryToken(<EntityName>),
                    useValue: mockRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<<EntityName>Service>(<EntityName>Service);
        repository = module.get<Repository<<EntityName>>>(getRepositoryToken(<EntityName>));
        dataSource = module.get<DataSource>(DataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new entity successfully', async () => {
            const createDto: Create<EntityName>Dto = {
                name: 'Test Name',
                isEnabled: true,
            };

            const entity = new <EntityName>();
            Object.assign(entity, createDto);
            entity.id = 'test-id';

            mockRepository.create.mockReturnValue(entity);
            mockRepository.save.mockResolvedValue(entity);

            const result = await service.create(createDto);

            expect(result).toBeDefined();
            expect(result.id).toBe('test-id');
            expect(result.name).toBe(createDto.name);
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(entity);
        });

        it('should handle unique constraint violations', async () => {
            const createDto: Create<EntityName>Dto = {
                name: 'Test Name',
                isEnabled: true,
            };

            mockRepository.create.mockReturnValue(new <EntityName>());
            mockRepository.save.mockRejectedValue(new QueryFailedError('query', [], 'unique constraint'));

            await expect(service.create(createDto)).rejects.toThrow('Failed to create <EntityName> due to constraint violation');
        });
    });

    // Additional test cases for update, delete, findById, etc.
});
``` 
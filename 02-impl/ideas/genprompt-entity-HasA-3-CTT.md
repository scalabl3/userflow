# Entity Generation Guide - Has-A Relationship - Part 3: Controller, Controller Tests, Model Tests (CTT)

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
You are a seasoned veteran software engineer focused on building robust REST APIs with comprehensive test coverage for entities with Has-A relationships. Your role in this third phase is to generate the controller implementation and comprehensive tests. Focus on proper request/response handling, relationship validation, and thorough testing of both the controller and model. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples: 
- `OwnerEntityName` has-a `EntityName`
- User has-a Profile
- class User { @OneToOne(() => Profile) profile: Profile; }

### Files to Generate

1. Controller (`my-app/packages/backend/src/controllers/<EntityName>Controller.ts`)
   - Controller class with route decorators
   - Request validation with relationships
   - Response handling with relationships
   - Error handling for relationship constraints
   - Swagger documentation for relationships

2. Tests
   - Controller Tests (`my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`)
     - Endpoint tests with relationships
     - Error handling tests for relationships
     - Request validation tests for relationships
     - Response format tests with relationships
     
   - Model Tests (`my-app/packages/backend/src/models/<EntityName>.spec.ts`)
     - Validation tests for relationships
     - Constraint tests for relationships
     - Method tests with relationships
     - Edge case tests for relationships

### Verification Checklist
- [ ] Controller handles relationship operations properly
- [ ] Request validation includes relationship fields
- [ ] Response handling includes relationships
- [ ] Error handling covers relationship constraints
- [ ] Swagger documentation includes relationships
- [ ] Controller tests cover relationship endpoints
- [ ] Controller tests cover relationship errors
- [ ] Model tests cover relationship validations
- [ ] Model tests cover relationship constraints
- [ ] All imports properly organized

### Code Structure Guidelines

#### Controller Structure
Required Imports:
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EntityName } from '../models/EntityName';
import { EntityNameService } from '../services/EntityNameService';
import { CreateEntityNameDto, UpdateEntityNameDto, ResponseEntityNameDto } from '@my-app/shared';
import { ControllerBase } from '../utils/controller-utils';
```

Key Points:
- Extend ControllerBase for consistent error handling
- Use protected logger and RESOURCE_NAME
- Implement proper DTO transformations
- Handle relationship-specific errors
- Document with Swagger
- Follow REST conventions
- Include proper logging
- Add relationship-specific endpoints

Example Pattern:
```typescript
@Controller('entity-names')
@ApiTags('entity-names')
export class EntityNameController extends ControllerBase {
    protected readonly RESOURCE_NAME = 'EntityName';
    protected readonly logger = new Logger(EntityNameController.name);

    constructor(private readonly entityNameService: EntityNameService) {
        super();
    }

    @Post()
    @ApiOperation({ summary: 'Create new entity' })
    @ApiResponse({ status: 201, type: ResponseEntityNameDto })
    async create(@Body() createEntityNameDto: CreateEntityNameDto): Promise<ResponseEntityNameDto> {
        try {
            const entity = await this.entityNameService.create(createEntityNameDto);
            const response = this.toResponseDto(entity, ResponseEntityNameDto);
            if (!response) {
                this.handleBadRequest('Failed to create entity', 'create', { dto: createEntityNameDto });
            }
            return response;
        } catch (error) {
            this.handleError(error, 'create', undefined, { dto: createEntityNameDto });
        }
    }

    @Get('owner/:ownerId')
    @ApiOperation({ summary: 'Get entities by owner ID' })
    @ApiResponse({ status: 200, type: [ResponseEntityNameDto] })
    @ApiResponse({ status: 404, description: 'Owner not found' })
    async findByOwnerId(@Param('ownerId') ownerId: string): Promise<ResponseEntityNameDto[]> {
        try {
            const entities = await this.entityNameService.findByOwnerId(ownerId);
            return this.toResponseDtoArray(entities, ResponseEntityNameDto);
        } catch (error) {
            this.handleError(error, 'findByOwnerId', ownerId);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get entity by ID' })
    @ApiResponse({ status: 200, type: ResponseEntityNameDto })
    @ApiResponse({ status: 404, description: 'Entity not found' })
    async findOne(@Param('id') id: string): Promise<ResponseEntityNameDto> {
        try {
            const entity = await this.entityNameService.findOne(id);
            const response = this.toResponseDto(entity, ResponseEntityNameDto);
            if (!response) {
                this.handleNotFound(id, 'findOne');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'findOne', id);
        }
    }

    @Put(':id/owner/:ownerId')
    @ApiOperation({ summary: 'Update entity owner' })
    @ApiResponse({ status: 200, type: ResponseEntityNameDto })
    @ApiResponse({ status: 404, description: 'Entity or owner not found' })
    async updateOwner(
        @Param('id') id: string,
        @Param('ownerId') ownerId: string
    ): Promise<ResponseEntityNameDto> {
        try {
            const entity = await this.entityNameService.updateOwner(id, ownerId);
            const response = this.toResponseDto(entity, ResponseEntityNameDto);
            if (!response) {
                this.handleNotFound(id, 'updateOwner');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'updateOwner', id, { ownerId });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete entity' })
    @ApiResponse({ status: 200, description: 'Entity deleted successfully' })
    @ApiResponse({ status: 404, description: 'Entity not found' })
    async remove(@Param('id') id: string): Promise<void> {
        try {
            const success = await this.entityNameService.remove(id);
            if (!success) {
                this.handleNotFound(id, 'remove');
            }
        } catch (error) {
            this.handleError(error, 'remove', id);
        }
    }
}
```

#### Controller Test Structure
Required Imports:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { EntityNameController } from './EntityNameController';
import { EntityNameService } from '../services/EntityNameService';
import { CreateEntityNameDto, UpdateEntityNameDto, ResponseEntityNameDto } from '@my-app/shared';
import { NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { entityName as entityMock } from '../test/__mocks__/entityName.mock';
import { ownerEntityName as ownerMock } from '../test/__mocks__/ownerEntityName.mock';
import { DataSource } from 'typeorm';
```

Key Points:
- Mock service and DataSource dependencies
- Use shared mock files for test data
- Test all endpoints comprehensively
- Cover all error scenarios
- Test response transformations
- Follow AAA pattern
- Include relationship edge cases
- Consistent error handling
- Clear test descriptions
- Reset mocks between tests
- Test relationship-specific endpoints
- Verify relationship constraints

Example Pattern:
```typescript
describe('EntityNameController', () => {
    let controller: EntityNameController;
    let service: EntityNameService;

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn()
        }
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner)
    };

    // Use shared mock data
    const mockEntity = entityMock.standard;
    const mockOwner = ownerMock.standard;
    const mockEntityDto = plainToClass(ResponseEntityNameDto, mockEntity, { excludeExtraneousValues: true });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EntityNameController],
            providers: [
                {
                    provide: EntityNameService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        findByOwnerId: jest.fn(),
                        update: jest.fn(),
                        updateOwner: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        controller = module.get<EntityNameController>(EntityNameController);
        service = module.get<EntityNameService>(EntityNameService);

        // Reset mocks between tests
        jest.clearAllMocks();
    });

    describe('Controller Setup', () => {
        it('should be defined', () => {
            expect(controller).toBeDefined();
            expect(service).toBeDefined();
        });
    });

    describe('findByOwnerId', () => {
        it('should return entities by owner ID', async () => {
            const entities = [mockEntity];
            jest.spyOn(service, 'findByOwnerId').mockResolvedValue(entities);
            
            const result = await controller.findByOwnerId(mockOwner.id);
            
            expect(result).toEqual([mockEntityDto]);
            expect(service.findByOwnerId).toHaveBeenCalledWith(mockOwner.id);
        });

        it('should return empty array when no entities exist for owner', async () => {
            jest.spyOn(service, 'findByOwnerId').mockResolvedValue([]);
            
            const result = await controller.findByOwnerId(mockOwner.id);
            
            expect(result).toEqual([]);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findByOwnerId').mockRejectedValue(new Error());
            
            await expect(controller.findByOwnerId(mockOwner.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('updateOwner', () => {
        it('should update entity owner', async () => {
            const updatedEntity = { ...mockEntity, ownerId: mockOwner.id };
            jest.spyOn(service, 'updateOwner').mockResolvedValue(updatedEntity);
            
            const result = await controller.updateOwner(mockEntity.id, mockOwner.id);
            
            expect(result).toEqual(plainToClass(ResponseEntityNameDto, updatedEntity, { excludeExtraneousValues: true }));
            expect(service.updateOwner).toHaveBeenCalledWith(mockEntity.id, mockOwner.id);
        });

        it('should throw NotFoundException when entity does not exist', async () => {
            jest.spyOn(service, 'updateOwner').mockResolvedValue(null);
            
            await expect(controller.updateOwner('nonexistent-id', mockOwner.id)).rejects.toThrow(
                new NotFoundException('EntityName with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'updateOwner').mockRejectedValue(new Error());
            
            await expect(controller.updateOwner(mockEntity.id, mockOwner.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    // Include standard CRUD test cases as well...
});
```

#### Model Test Structure
Required Imports:
```typescript
import { validate } from 'class-validator';
import { Example } from './Example';
```

Key Points:
- Test relationship validations
- Test relationship constraints
- Test relationship methods
- Test relationship edge cases
- Use proper assertions
- Follow AAA pattern
- Include cleanup
- Test relationship errors

Example Pattern:
```typescript
describe('Example', () => {
    let entity: Example;

    beforeEach(() => {
        entity = new Example();
    });

    describe('relationship validation', () => {
        it('should validate with owner relationship', async () => {
            entity.owner_id = '456';
            entity.field = 'Test Value';

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });

        it('should fail validation without required owner_id', async () => {
            entity.field = 'Test Value';

            const errors = await validate(entity);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });

        it('should validate optional relationship fields', async () => {
            entity.owner_id = '456';
            entity.field = 'Test Value';
            entity.owner_notes = 'Optional notes';

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });
    });

    describe('relationship methods', () => {
        it('should handle owner relationship changes', () => {
            entity.owner_id = '456';
            entity.updateOwner('789');
            
            expect(entity.owner_id).toBe('789');
            expect(entity.previous_owner_id).toBe('456');
        });

        it('should handle relationship edge cases', () => {
            entity.updateOwner(null);
            
            expect(entity.owner_id).toBeNull();
            expect(entity.previous_owner_id).toBeNull();
        });
    });
}); 
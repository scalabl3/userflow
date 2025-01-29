# Entity Generation Guide - Is-A Relationship - Part 3: Controller, Controller Tests, Model Tests (CTT)

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
You are a seasoned veteran software engineer focused on building robust REST APIs with comprehensive test coverage for entities with Is-A relationships. Your role in this third phase is to generate the controller implementation and comprehensive tests. Focus on proper request/response handling, inheritance validation, and thorough testing of both the controller and model. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples: 
- `EntityName` is-a `BaseEntityName`
- AdminUser is-a User
- class AdminUser extends User {}

### Files to Generate

1. Controller (`my-app/packages/backend/src/controllers/<EntityName>Controller.ts`)
   - Controller class with route decorators
   - Request validation with inheritance
   - Response handling with inheritance
   - Error handling for inheritance constraints
   - Swagger documentation for inheritance

2. Tests
   - Controller Tests (`my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`)
     - Endpoint tests with inheritance
     - Error handling tests for inheritance
     - Request validation tests for inheritance
     - Response format tests with inheritance
   - Model Tests (`my-app/packages/backend/src/models/<EntityName>.spec.ts`)
     - Validation tests for inheritance
     - Constraint tests for inheritance
     - Method tests with inheritance
     - Edge case tests for inheritance

### Verification Checklist
- [ ] Controller handles inheritance operations properly
- [ ] Request validation includes inherited fields
- [ ] Response handling includes inheritance
- [ ] Error handling covers inheritance constraints
- [ ] Swagger documentation includes inheritance
- [ ] Controller tests cover inheritance endpoints
- [ ] Controller tests cover inheritance errors
- [ ] Model tests cover inheritance validations
- [ ] Model tests cover inheritance constraints
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
import { BaseEntityNameController } from './BaseEntityNameController';
```

Key Points:
- Extend base controller that already extends ControllerBase
- Override base methods with specialized behavior
- Add specialized endpoints
- Handle inheritance-specific errors
- Document with Swagger
- Follow REST conventions
- Include proper logging
- Add specialized validation methods

Example Pattern:
```typescript
@Controller('specialized-entity-names')
@ApiTags('specialized-entity-names')
export class SpecializedEntityNameController extends BaseEntityNameController {
    protected readonly RESOURCE_NAME = 'SpecializedEntityName';
    protected readonly logger = new Logger(SpecializedEntityNameController.name);

    constructor(private readonly specializedEntityNameService: SpecializedEntityNameService) {
        super(specializedEntityNameService);
    }

    @Post()
    @ApiOperation({ summary: 'Create new specialized entity' })
    @ApiResponse({ status: 201, type: ResponseSpecializedEntityNameDto })
    async create(@Body() createDto: CreateSpecializedEntityNameDto): Promise<ResponseSpecializedEntityNameDto> {
        try {
            // Add specialized validation or preprocessing
            if (!this.validateSpecializedFields(createDto)) {
                this.handleBadRequest('Invalid specialized entity data', 'create', { dto: createDto });
            }

            const entity = await this.specializedEntityNameService.create(createDto);
            const response = this.toResponseDto(entity, ResponseSpecializedEntityNameDto);
            if (!response) {
                this.handleBadRequest('Failed to create specialized entity', 'create', { dto: createDto });
            }
            return response;
        } catch (error) {
            this.handleError(error, 'create', undefined, { dto: createDto });
        }
    }

    @Get('specialized-query')
    @ApiOperation({ summary: 'Specialized query endpoint' })
    @ApiResponse({ status: 200, type: [ResponseSpecializedEntityNameDto] })
    async specializedQuery(): Promise<ResponseSpecializedEntityNameDto[]> {
        try {
            const entities = await this.specializedEntityNameService.specializedQuery();
            return this.toResponseDtoArray(entities, ResponseSpecializedEntityNameDto);
        } catch (error) {
            this.handleError(error, 'specializedQuery');
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update specialized entity' })
    @ApiResponse({ status: 200, type: ResponseSpecializedEntityNameDto })
    @ApiResponse({ status: 404, description: 'Entity not found' })
    async update(
        @Param('id') id: string,
        @Body() updateDto: UpdateSpecializedEntityNameDto
    ): Promise<ResponseSpecializedEntityNameDto> {
        try {
            // Add specialized validation or preprocessing
            if (!this.validateSpecializedFields(updateDto)) {
                this.handleBadRequest('Invalid specialized entity data', 'update', { dto: updateDto });
            }

            const entity = await this.specializedEntityNameService.update(id, updateDto);
            const response = this.toResponseDto(entity, ResponseSpecializedEntityNameDto);
            if (!response) {
                this.handleNotFound(id, 'update');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'update', id, { dto: updateDto });
        }
    }

    // Override base method to add specialized handling
    protected validateSpecializedFields(dto: CreateSpecializedEntityNameDto | UpdateSpecializedEntityNameDto): boolean {
        // Add specialized validation logic
        if (!dto.specializedField) {
            return false;
        }
        return true;
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
import { parentEntity as parentMock } from '../test/__mocks__/parentEntity.mock';
import { DataSource } from 'typeorm';
```

Key Points:
- Mock service and DataSource dependencies
- Use shared mock files for test data
- Test all endpoints comprehensively
- Cover all error scenarios
- Test response transformations
- Follow AAA pattern
- Include inheritance edge cases
- Consistent error handling
- Clear test descriptions
- Reset mocks between tests
- Test inheritance-specific behavior
- Verify type constraints

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
    const mockParent = parentMock.standard;
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
                        findByType: jest.fn(),
                        update: jest.fn(),
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

    describe('findByType', () => {
        it('should return entities by type', async () => {
            const entities = [mockEntity];
            jest.spyOn(service, 'findByType').mockResolvedValue(entities);
            
            const result = await controller.findByType(mockEntity.type);
            
            expect(result).toEqual([mockEntityDto]);
            expect(service.findByType).toHaveBeenCalledWith(mockEntity.type);
        });

        it('should return empty array when no entities exist for type', async () => {
            jest.spyOn(service, 'findByType').mockResolvedValue([]);
            
            const result = await controller.findByType('nonexistent-type');
            
            expect(result).toEqual([]);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findByType').mockRejectedValue(new Error());
            
            await expect(controller.findByType(mockEntity.type)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('create', () => {
        const createDto: CreateEntityNameDto = entityMock.dtos.create;

        it('should create a new entity with inheritance type', async () => {
            jest.spyOn(service, 'create').mockResolvedValue(mockEntity);
            
            const result = await controller.create(createDto);
            
            expect(result).toEqual(mockEntityDto);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });

        it('should handle type validation errors', async () => {
            const invalidDto = { ...createDto, type: 'invalid-type' };
            jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException('Invalid type'));
            
            await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'create').mockRejectedValue(new Error());
            
            await expect(controller.create(createDto)).rejects.toThrow(
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
- Test inheritance validations
- Test inheritance constraints
- Test inherited methods
- Test inheritance edge cases
- Use proper assertions
- Follow AAA pattern
- Include cleanup
- Test inheritance errors

Example Pattern:
```typescript
describe('Example', () => {
    let entity: Example;

    beforeEach(() => {
        entity = new Example();
    });

    describe('inheritance validation', () => {
        it('should validate with inherited fields', async () => {
            entity.base_field = 'Base Value';
            entity.additional_field = 'Additional Value';

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });

        it('should fail validation without required inherited field', async () => {
            entity.additional_field = 'Additional Value';

            const errors = await validate(entity);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });

        it('should validate optional inherited fields', async () => {
            entity.base_field = 'Base Value';
            entity.additional_field = 'Additional Value';
            entity.optional_base_field = 'Optional Base Value';

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });
    });

    describe('inherited methods', () => {
        it('should override base method correctly', () => {
            entity.base_field = 'Base Value';
            entity.additional_field = 'Additional Value';
            
            expect(entity.calculateTotal()).toBe(220); // with 20% markup instead of 10%
        });

        it('should handle inheritance edge cases', () => {
            entity.base_field = null;
            entity.additional_field = 'Additional Value';
            
            expect(entity.calculateTotal()).toBe(0);
        });
    });
});
``` 
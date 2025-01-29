# Entity Generation Guide - Part 3: Controller, Controller Tests, Model Tests (CTT)

## Instructions for Template Creation
- Replace `<EntityName>` with the actual entity name in PascalCase
- Replace `<entityName>` with the entity name in camelCase
- Ensure consistent casing across all files:
  - PascalCase for classes and types
  - camelCase for methods and properties
- Verify all paths and imports are correct
- Remove any unnecessary code or comments
- Keep examples minimal but clear

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer focused on building robust REST APIs with comprehensive test coverage. Your role in this third phase is to generate the controller implementation and comprehensive tests. Focus on proper request/response handling, validation, and thorough testing of both the controller and model. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Files to Generate

1. Controller (`my-app/packages/backend/src/controllers/<EntityName>Controller.ts`)
   - Controller class with route decorators
   - Request validation
   - Response handling
   - Error handling
   - Swagger documentation

2. Tests
   - Controller Tests (`my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`)
     - Endpoint tests
     - Error handling tests
     - Request validation tests
     - Response format tests
   - Model Tests (`my-app/packages/backend/src/models/<EntityName>.spec.ts`)
     - Validation tests
     - Constraint tests
     - Method tests
     - Edge case tests

### Verification Checklist
- [ ] Controller follows REST patterns
- [ ] Request validation is comprehensive
- [ ] Response handling is proper
- [ ] Error handling is proper
- [ ] Swagger documentation is complete
- [ ] Controller tests cover all endpoints
- [ ] Controller tests cover error cases
- [ ] Model tests cover all validations
- [ ] Model tests cover all constraints
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
- Handle all errors consistently
- Document with Swagger
- Follow REST conventions
- Include proper logging

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

    @Put(':id')
    @ApiOperation({ summary: 'Update entity' })
    @ApiResponse({ status: 200, type: ResponseEntityNameDto })
    @ApiResponse({ status: 404, description: 'Entity not found' })
    async update(
        @Param('id') id: string,
        @Body() updateEntityNameDto: UpdateEntityNameDto
    ): Promise<ResponseEntityNameDto> {
        try {
            const entity = await this.entityNameService.update(id, updateEntityNameDto);
            const response = this.toResponseDto(entity, ResponseEntityNameDto);
            if (!response) {
                this.handleNotFound(id, 'update');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'update', id, { dto: updateEntityNameDto });
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
import { NotFoundException } from '@nestjs/common';
import { ExampleController } from './ExampleController';
import { ExampleService } from '../services/ExampleService';
```

Key Points:
- Mock service dependencies
- Test all endpoints
- Cover validation errors
- Test response formats
- Use proper assertions
- Follow AAA pattern
- Include edge cases
- Test error responses

Example Pattern:
```typescript
describe('ExampleController', () => {
    let controller: ExampleController;
    let service: ExampleService;

    const mockEntity = {
        id: '123',
        name: 'Test'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExampleController],
            providers: [
                {
                    provide: ExampleService,
                    useValue: {
                        findById: jest.fn(),
                        update: jest.fn()
                    }
                }
            ]
        }).compile();

        controller = module.get<ExampleController>(ExampleController);
        service = module.get<ExampleService>(ExampleService);
    });

    describe('findById', () => {
        it('should return entity by id', async () => {
            jest.spyOn(service, 'findById').mockResolvedValue(mockEntity);

            const result = await controller.findById('123');

            expect(result).toBeDefined();
            expect(result).toEqual(mockEntity);
            expect(service.findById).toHaveBeenCalledWith('123');
        });

        it('should throw NotFoundException when entity not found', async () => {
            jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException());

            await expect(controller.findById('999'))
                .rejects
                .toThrow(NotFoundException);
        });
    });
});
```

#### Model Test Structure
Required Imports:
```typescript
import { validate } from 'class-validator';
import { Example } from './Example';
```

Key Points:
- Test all validations
- Test all constraints
- Test custom methods
- Test edge cases
- Use proper assertions
- Follow AAA pattern
- Include cleanup
- Test error cases

Example Pattern:
```typescript
describe('Example', () => {
    let entity: Example;

    beforeEach(() => {
        entity = new Example();
    });

    describe('validation', () => {
        it('should validate with all required fields', async () => {
            entity.name = 'Test Name';
            entity.email = 'test@example.com';

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });

        it('should fail validation without required name', async () => {
            entity.email = 'test@example.com';

            const errors = await validate(entity);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });

        it('should validate optional fields', async () => {
            entity.name = 'Test Name';
            entity.email = 'test@example.com';
            entity.description = 'Optional description';

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });
    });

    describe('methods', () => {
        it('should calculate derived values correctly', () => {
            entity.value = 100;
            
            expect(entity.calculateTotal()).toBe(110); // with 10% markup
        });

        it('should handle edge cases in calculations', () => {
            entity.value = 0;
            
            expect(entity.calculateTotal()).toBe(0);
        });
    });
}); 
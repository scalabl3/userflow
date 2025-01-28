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
import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EntityName } from '../models/EntityName';
import { BaseEntityName } from '../models/BaseEntityName';
import { EntityNameService } from '../services/EntityNameService';
import { CreateEntityNameDto, UpdateEntityNameDto, ResponseEntityNameDto } from '@my-app/shared';
```

Key Points:
- Use proper HTTP method decorators
- Implement inheritance validation
- Handle responses with inheritance
- Handle inheritance errors
- Document inheritance with Swagger
- Follow REST conventions
- Include proper logging

Example Pattern:
```typescript
@Controller('examples')
@ApiTags('examples')
export class ExampleController extends BaseController {
    constructor(
        private readonly service: ExampleService
    ) {
        super(service);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get example by ID' })
    @ApiResponse({ status: 200, type: ResponseExampleDto })
    async findById(@Param('id') id: string): Promise<ResponseExampleDto> {
        return this.service.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update example' })
    @ApiResponse({ status: 200, type: ResponseExampleDto })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateExampleDto
    ): Promise<ResponseExampleDto> {
        return this.service.update(id, dto);
    }

    // Override base method with specific implementation
    @Get('type/:type')
    @ApiOperation({ summary: 'Get examples by type' })
    @ApiResponse({ status: 200, type: [ResponseExampleDto] })
    async findByType(@Param('type') type: string): Promise<ResponseExampleDto[]> {
        return this.service.findByType(type);
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
- Test inherited endpoints
- Cover inheritance validation
- Test inheritance responses
- Use proper assertions
- Follow AAA pattern
- Include inheritance edge cases
- Test inheritance errors

Example Pattern:
```typescript
describe('ExampleController', () => {
    let controller: ExampleController;
    let service: ExampleService;

    const mockEntity = {
        id: '123',
        base_field: 'Base Value',
        additional_field: 'Additional Value',
        type: 'example'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExampleController],
            providers: [
                {
                    provide: ExampleService,
                    useValue: {
                        findById: jest.fn(),
                        findByType: jest.fn(),
                        update: jest.fn()
                    }
                }
            ]
        }).compile();

        controller = module.get<ExampleController>(ExampleController);
        service = module.get<ExampleService>(ExampleService);
    });

    describe('findByType', () => {
        it('should return entities by type', async () => {
            const entities = [mockEntity];
            
            jest.spyOn(service, 'findByType').mockResolvedValue(entities);
            
            const result = await controller.findByType('example');
            
            expect(result).toBeDefined();
            expect(result).toEqual(entities);
            expect(service.findByType).toHaveBeenCalledWith('example');
        });

        it('should handle empty result for type', async () => {
            jest.spyOn(service, 'findByType').mockResolvedValue([]);
            
            const result = await controller.findByType('unknown');
            
            expect(result).toEqual([]);
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
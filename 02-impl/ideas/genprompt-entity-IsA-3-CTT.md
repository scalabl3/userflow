# Entity Generation Guide - Is-A Relationship - Part 3: Controller, Controller Tests, Model Tests (CTT)

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this third phase is to generate the controller layer and comprehensive tests for an entity that has an Is-A relationship with another entity. Focus on API design, inheritance handling, and thorough testing. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples:
- `EntityName` is-a `BaseEntityName`
- AdminUser is-a User
- class AdminUser extends User {}

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase (e.g., AdminUser)
- Replace `<BaseEntityName>` with the base entity name in PascalCase (e.g., User)
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files
  - camelCase for properties and methods

### Entity Specification
{entity model stub goes here}

### Files to Generate

1. Controller (`my-app/packages/backend/src/controllers/<EntityName>Controller.ts`)
   - REST endpoints
   - Request/Response handling
   - Error handling
   - OpenAPI documentation
   - Inheritance-specific endpoints

2. Tests
   - Controller Tests (`my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`)
     - Endpoint tests
     - Error handling tests
     - Request validation tests
     - Inheritance operation tests
   - Model Tests (`my-app/packages/backend/src/models/<EntityName>.spec.ts`)
     - Validation tests
     - Constraint tests
     - Inheritance tests

### Verification Checklist
- [ ] Controller uses /api prefix in routes
- [ ] Comprehensive OpenAPI/Swagger decorators
- [ ] Proper validation pipes implemented
- [ ] Auth guards properly set up
- [ ] Consistent response transformation
- [ ] Query parameter handling
- [ ] Proper error response structure
- [ ] Controller tests cover all endpoints
- [ ] Model tests cover all validations
- [ ] Integration tests included
- [ ] Inheritance endpoints properly tested
- [ ] Base entity functionality properly tested

### File Generation Guidelines

#### Controller Guidelines
- Use `/api/<entity-name>` base path
- Include comprehensive OpenAPI/Swagger decorators
- Implement proper validation pipes
- Include proper auth guards
- Transform responses consistently
- Handle query parameters properly
- Include inheritance-specific endpoints
- Follow consistent error response structure
- Use proper HTTP status codes
- Handle inheritance validation

#### Controller Test Guidelines
- Test all endpoints
- Test validation errors
- Test auth guards
- Test query parameters
- Test response formats
- Test error responses
- Test inheritance operations
- Use proper request mocking
- Include integration tests
- Test base entity interactions

#### Model Test Guidelines
- Test all validations
- Test unique constraints
- Test default values
- Test inheritance constraints
- Test lifecycle hooks
- Test custom methods
- Use factory patterns
- Test edge cases
- Include proper cleanup
- Test inheritance validations

### Generic Stubs

#### Controller Stub
```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { <EntityName>Service } from '../services/<EntityName>Service';
import { Create<EntityName>Dto, Update<EntityName>Dto, Response<EntityName>Dto } from '@my-app/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('<EntityName>')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/<entity-name>')
export class <EntityName>Controller {
    constructor(private readonly service: <EntityName>Service) {}

    @Post()
    @ApiOperation({ summary: 'Create a new <EntityName>' })
    @ApiResponse({ 
        status: 201, 
        description: 'The <EntityName> has been successfully created.',
        type: Response<EntityName>Dto
    })
    async create(@Body() dto: Create<EntityName>Dto): Promise<Response<EntityName>Dto> {
        return this.service.create(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a <EntityName> by id' })
    @ApiResponse({ 
        status: 200, 
        description: 'The <EntityName> has been successfully retrieved.',
        type: Response<EntityName>Dto
    })
    @ApiResponse({ status: 404, description: '<EntityName> not found' })
    async findById(@Param('id') id: string): Promise<Response<EntityName>Dto> {
        return this.service.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a <EntityName>' })
    @ApiResponse({ 
        status: 200, 
        description: 'The <EntityName> has been successfully updated.',
        type: Response<EntityName>Dto
    })
    @ApiResponse({ status: 404, description: '<EntityName> not found' })
    async update(
        @Param('id') id: string,
        @Body() dto: Update<EntityName>Dto
    ): Promise<Response<EntityName>Dto> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a <EntityName>' })
    @ApiResponse({ status: 204, description: 'The <EntityName> has been successfully deleted.' })
    @ApiResponse({ status: 404, description: '<EntityName> not found' })
    async delete(@Param('id') id: string): Promise<void> {
        await this.service.delete(id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all <EntityName>s' })
    @ApiResponse({ 
        status: 200, 
        description: 'List of <EntityName>s retrieved successfully.',
        type: [Response<EntityName>Dto]
    })
    async findAll(): Promise<Response<EntityName>Dto[]> {
        return this.service.findAll();
    }
}
```

#### Controller Test Stub
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { <EntityName>Controller } from './<EntityName>Controller';
import { <EntityName>Service } from '../services/<EntityName>Service';
import { Create<EntityName>Dto, Update<EntityName>Dto, Response<EntityName>Dto } from '@my-app/shared';
import { EntityNotFoundError } from 'typeorm';

describe('<EntityName>Controller', () => {
    let controller: <EntityName>Controller;
    let service: <EntityName>Service;

    const mockService = {
        create: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [<EntityName>Controller],
            providers: [
                {
                    provide: <EntityName>Service,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<<EntityName>Controller>(<EntityName>Controller);
        service = module.get<<EntityName>Service>(<EntityName>Service);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new entity successfully', async () => {
            const createDto: Create<EntityName>Dto = {
                specialField: 'Test Special',
                isSpecial: true,
            };

            const expectedResponse: Response<EntityName>Dto = {
                id: 'test-id',
                specialField: 'Test Special',
                isSpecial: true,
                createdAt: new Date(),
                modifiedAt: new Date(),
            };

            mockService.create.mockResolvedValue(expectedResponse);

            const result = await controller.create(createDto);

            expect(result).toBe(expectedResponse);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('findById', () => {
        it('should find entity by id successfully', async () => {
            const id = 'test-id';
            const expectedResponse: Response<EntityName>Dto = {
                id,
                specialField: 'Test Special',
                isSpecial: true,
                createdAt: new Date(),
                modifiedAt: new Date(),
            };

            mockService.findById.mockResolvedValue(expectedResponse);

            const result = await controller.findById(id);

            expect(result).toBe(expectedResponse);
            expect(service.findById).toHaveBeenCalledWith(id);
        });

        it('should throw error when entity not found', async () => {
            const id = 'non-existent-id';
            mockService.findById.mockRejectedValue(
                new EntityNotFoundError(<EntityName>, `<EntityName> with id ${id} not found`)
            );

            await expect(controller.findById(id)).rejects.toThrow(EntityNotFoundError);
        });
    });

    // Additional test cases for update, delete, findAll, etc.
});
```

#### Model Test Stub
```typescript
import { validate } from 'class-validator';
import { <EntityName> } from './<EntityName>';

describe('<EntityName>', () => {
    let entity: <EntityName>;

    beforeEach(() => {
        entity = new <EntityName>();
    });

    describe('validation', () => {
        it('should validate with all required fields', async () => {
            entity.specialField = 'Test Special';
            entity.isSpecial = true;

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });

        it('should fail validation without required specialField', async () => {
            entity.isSpecial = true;

            const errors = await validate(entity);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });

        it('should validate with optional fields', async () => {
            entity.specialField = 'Test Special';
            entity.isSpecial = true;
            entity.additionalInfo = 'Additional Info';

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });

        it('should inherit base entity validations', async () => {
            // Test base entity validations are properly inherited
            entity.specialField = 'Test Special';
            entity.isSpecial = true;
            
            // Add base entity required fields here
            // entity.baseField = 'Base Value';

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });
    });

    // Additional test cases for inheritance, custom methods, etc.
});
``` 
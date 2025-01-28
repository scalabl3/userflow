# Entity Generation Guide - Part 3: Controller, controller Tests, model Tests (CTT)

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
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this third phase is to generate the controller layer and comprehensive tests. Focus on API design, request handling, and thorough testing. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase
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

2. Tests
   - Controller Tests (`my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`)
     - Endpoint tests
     - Error handling tests
     - Request validation tests
   - Model Tests (`my-app/packages/backend/src/models/<EntityName>.spec.ts`)
     - Validation tests
     - Constraint tests
     - Relationship tests

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

### File Generation Guidelines

#### Controller Guidelines
- Use `/api` prefix in routes
- Include comprehensive OpenAPI/Swagger decorators
- Implement proper validation pipes
- Include proper auth guards
- Transform responses consistently
- Handle query parameters properly
- Include specialized endpoints
- Follow consistent error response structure
- Use proper HTTP status codes
- Handle file uploads/downloads if needed

#### Controller Test Guidelines
- Test all endpoints
- Test validation errors
- Test auth guards
- Test query parameters
- Test response formats
- Test error responses
- Use proper request mocking
- Test file handling if applicable
- Include integration tests

#### Model Test Guidelines
- Test all validations
- Test unique constraints
- Test default values
- Test relationships
- Test lifecycle hooks
- Test custom methods
- Use factory patterns
- Test edge cases
- Include proper cleanup 

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

    @Put(':id/enable')
    @ApiOperation({ summary: 'Enable a <EntityName>' })
    @ApiResponse({ 
        status: 200, 
        description: 'The <EntityName> has been successfully enabled.',
        type: Response<EntityName>Dto
    })
    async enable(@Param('id') id: string): Promise<Response<EntityName>Dto> {
        return this.service.enable(id);
    }

    @Put(':id/disable')
    @ApiOperation({ summary: 'Disable a <EntityName>' })
    @ApiResponse({ 
        status: 200, 
        description: 'The <EntityName> has been successfully disabled.',
        type: Response<EntityName>Dto
    })
    async disable(@Param('id') id: string): Promise<Response<EntityName>Dto> {
        return this.service.disable(id);
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
        enable: jest.fn(),
        disable: jest.fn(),
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
                name: 'Test Name',
                isEnabled: true,
            };

            const expectedResponse: Response<EntityName>Dto = {
                id: 'test-id',
                name: 'Test Name',
                isEnabled: true,
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
                name: 'Test Name',
                isEnabled: true,
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
            entity.name = 'Test Name';
            entity.isEnabled = true;

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });

        it('should fail validation without required name', async () => {
            entity.isEnabled = true;

            const errors = await validate(entity);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });

        it('should validate with optional fields', async () => {
            entity.name = 'Test Name';
            entity.isEnabled = true;
            entity.ownerId = '123e4567-e89b-12d3-a456-426614174000';

            const errors = await validate(entity);
            expect(errors.length).toBe(0);
        });

        it('should fail validation with invalid UUID for ownerId', async () => {
            entity.name = 'Test Name';
            entity.isEnabled = true;
            entity.ownerId = 'invalid-uuid';

            const errors = await validate(entity);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isUuid');
        });
    });

    // Additional test cases for relationships, custom methods, etc.
}); 
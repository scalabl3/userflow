# Entity Generation Guide - Part 3: Controller, Controller Tests, Model Tests (CTT)

## Instructions for Template Creation
- Replace `<EntityName>` with BillingProvider in PascalCase
- Replace `<entityName>` with billingProvider in camelCase
- Ensure consistent casing across all files:
  - PascalCase for classes and types
  - camelCase for methods and properties
- Verify all paths and imports are correct
- Remove any unnecessary code or comments
- Keep examples minimal but clear

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer focused on building robust REST APIs with comprehensive test coverage. Your role in this third phase is to generate the controller implementation and comprehensive tests. Focus on proper request/response handling, validation, and thorough testing of both the controller and model. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Entity Specification
BillingProvider represents a payment provider supported by the system. Key aspects:
- Each provider has a unique name (e.g., Stripe, Apple Pay, Google Pay, PayPal)
- Providers can be enabled/disabled for system-wide use
- Providers can be made visible/invisible to users
- Provider type is an enum of supported providers
- Provider requires configuration and credentials (to be expanded later)
- Similar pattern to LoginProvider in terms of usage and management

### Files to Generate

1. Controller (`my-app/packages/backend/src/controllers/BillingProviderController.ts`)
   - Controller class with route decorators for provider management
   - Request validation for unique provider names
   - Response handling with provider status
   - Error handling for duplicate names
   - Swagger documentation for provider endpoints

2. Tests
   - Controller Tests (`my-app/packages/backend/src/controllers/BillingProviderController.spec.ts`)
     - Provider endpoint tests
     - Error handling for duplicate names
     - Request validation for provider fields
     - Response format for provider status
   - Model Tests (`my-app/packages/backend/src/models/BillingProvider.spec.ts`)
     - Validation of unique name constraint
     - Provider type enum validation
     - Enabled/visible flag tests
     - Edge cases for provider status

### Verification Checklist
- [ ] Controller follows REST patterns for provider management
- [ ] Request validation checks provider name uniqueness
- [ ] Response handling includes provider status
- [ ] Error handling covers duplicate provider names
- [ ] Swagger documentation details provider operations
- [ ] Controller tests cover all provider endpoints
- [ ] Controller tests verify error handling
- [ ] Model tests validate provider constraints
- [ ] Model tests cover provider type validation
- [ ] All imports properly organized

### Code Structure Guidelines

#### Controller Structure
Required Imports:
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EntityName } from '../models/EntityName';
import { EntityNameService } from '../services/EntityNameService';
import { CreateEntityNameDto, UpdateEntityNameDto, ResponseEntityNameDto } from '@my-app/shared';
```

Key Points:
- Use proper HTTP method decorators
- Implement request validation
- Handle responses consistently
- Handle errors appropriately
- Document with Swagger
- Follow REST conventions
- Include proper logging

Example Pattern:
```typescript
@Controller('examples')
@ApiTags('examples')
export class ExampleController {
    constructor(
        private readonly service: ExampleService
    ) {}

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
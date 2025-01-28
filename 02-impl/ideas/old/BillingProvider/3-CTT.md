# Entity Generation Guide - Part 3: Controller, Controller Tests, Model Tests (CTT)

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer focused on building robust REST APIs with comprehensive test coverage. Your role in this third phase is to generate the controller implementation and comprehensive tests for the BillingProvider entity. Focus on proper REST endpoint design, validation, error handling, and thorough testing. Avoid speculation or overgeneration.

### Controller Layer Specification
BillingProviderController exposes REST endpoints for managing payment providers:
- CRUD operations via REST endpoints
- Provider state management endpoints
- Visibility control endpoints
- Proper response codes and error handling
- OpenAPI documentation
- Role-based access control

Key Endpoints:
- POST /billing-providers - Create new provider
- GET /billing-providers - List all providers
- GET /billing-providers/:id - Get provider by ID
- PATCH /billing-providers/:id - Update provider
- DELETE /billing-providers/:id - Delete provider
- PATCH /billing-providers/:id/enable - Enable provider
- PATCH /billing-providers/:id/disable - Disable provider
- PATCH /billing-providers/:id/visibility - Set provider visibility

### Files to Generate

1. Controller (`my-app/packages/backend/src/controllers/BillingProviderController.ts`)
   - REST endpoints
   - Request validation
   - Response serialization
   - Error handling
   - OpenAPI documentation
   - Role decorators

2. Controller Tests (`my-app/packages/backend/src/controllers/BillingProviderController.spec.ts`)
   - Unit tests for all endpoints
   - Error case coverage
   - Response validation
   - Mock service setup

3. Model Tests (`my-app/packages/backend/src/models/BillingProvider.spec.ts`)
   - Validation tests
   - Property constraints
   - Entity behavior

### Verification Checklist
- [ ] Controller follows REST conventions
- [ ] Proper HTTP status codes used
- [ ] Request validation implemented
- [ ] Response serialization correct
- [ ] OpenAPI documentation complete
- [ ] Role decorators applied
- [ ] Error responses standardized
- [ ] Test coverage for success cases
- [ ] Test coverage for error cases
- [ ] Model validation tested
- [ ] All imports properly organized

### File Generation Guidelines

#### Controller Guidelines
- Follow REST conventions
- Use proper HTTP status codes
- Implement request validation
- Add response serialization
- Include OpenAPI documentation
- Apply role decorators
- Handle errors properly
- Follow existing patterns

#### Controller Test Guidelines
- Test all endpoints
- Cover error cases
- Validate responses
- Mock service properly
- Follow existing patterns
- Include edge cases

#### Model Test Guidelines
- Test validation rules
- Test constraints
- Cover edge cases
- Follow existing patterns

### Generic Stubs

#### Controller Stub
```typescript
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    HttpStatus,
    HttpCode,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BillingProviderService } from '../services/BillingProviderService';
import { BillingProvider } from '../models/BillingProvider';
import { CreateBillingProviderDto } from '../dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '../dtos/BillingProvider/UpdateBillingProviderDto';
import { ResponseBillingProviderDto } from '../dtos/BillingProvider/ResponseBillingProviderDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';

@ApiTags('Billing Providers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('billing-providers')
export class BillingProviderController {
    constructor(private readonly billingProviderService: BillingProviderService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new billing provider' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The billing provider has been successfully created.',
        type: ResponseBillingProviderDto,
    })
    async create(@Body() dto: CreateBillingProviderDto): Promise<ResponseBillingProviderDto> {
        const provider = await this.billingProviderService.create(dto);
        return this.toResponseDto(provider);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all billing providers' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of all billing providers.',
        type: [ResponseBillingProviderDto],
    })
    async findAll(): Promise<ResponseBillingProviderDto[]> {
        const providers = await this.billingProviderService.findAll();
        return providers.map(provider => this.toResponseDto(provider));
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get a billing provider by ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The billing provider has been found.',
        type: ResponseBillingProviderDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'The billing provider was not found.',
    })
    async findOne(@Param('id') id: string): Promise<ResponseBillingProviderDto> {
        const provider = await this.billingProviderService.findById(id);
        return this.toResponseDto(provider);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a billing provider' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The billing provider has been successfully updated.',
        type: ResponseBillingProviderDto,
    })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateBillingProviderDto,
    ): Promise<ResponseBillingProviderDto> {
        const provider = await this.billingProviderService.update(id, dto);
        return this.toResponseDto(provider);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a billing provider' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'The billing provider has been successfully deleted.',
    })
    async remove(@Param('id') id: string): Promise<void> {
        await this.billingProviderService.delete(id);
    }

    @Patch(':id/enable')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Enable a billing provider' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The billing provider has been successfully enabled.',
        type: ResponseBillingProviderDto,
    })
    async enable(@Param('id') id: string): Promise<ResponseBillingProviderDto> {
        const provider = await this.billingProviderService.setEnabled(id, true);
        return this.toResponseDto(provider);
    }

    @Patch(':id/disable')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Disable a billing provider' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The billing provider has been successfully disabled.',
        type: ResponseBillingProviderDto,
    })
    async disable(@Param('id') id: string): Promise<ResponseBillingProviderDto> {
        const provider = await this.billingProviderService.setEnabled(id, false);
        return this.toResponseDto(provider);
    }

    @Patch(':id/visibility')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Set billing provider visibility' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The billing provider visibility has been successfully updated.',
        type: ResponseBillingProviderDto,
    })
    async setVisibility(
        @Param('id') id: string,
        @Body('isVisible') isVisible: boolean,
    ): Promise<ResponseBillingProviderDto> {
        const provider = await this.billingProviderService.setVisible(id, isVisible);
        return this.toResponseDto(provider);
    }

    private toResponseDto(provider: BillingProvider): ResponseBillingProviderDto {
        const response = new ResponseBillingProviderDto();
        Object.assign(response, provider);
        return response;
    }
}
```

#### Controller Test Stub
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { BillingProviderController } from './BillingProviderController';
import { BillingProviderService } from '../services/BillingProviderService';
import { BillingProvider, BillingProviderType } from '../models/BillingProvider';
import { CreateBillingProviderDto } from '../dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '../dtos/BillingProvider/UpdateBillingProviderDto';

describe('BillingProviderController', () => {
    let controller: BillingProviderController;
    let service: BillingProviderService;

    const mockProvider: BillingProvider = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Provider',
        providerType: BillingProviderType.STRIPE,
        isEnabled: false,
        isVisible: false,
        description: 'Test Description',
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        setEnabled: jest.fn(),
        setVisible: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BillingProviderController],
            providers: [
                {
                    provide: BillingProviderService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<BillingProviderController>(BillingProviderController);
        service = module.get<BillingProviderService>(BillingProviderService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new billing provider', async () => {
            const dto: CreateBillingProviderDto = {
                name: 'New Provider',
                providerType: BillingProviderType.STRIPE,
            };

            mockService.create.mockResolvedValue(mockProvider);

            const result = await controller.create(dto);
            expect(result).toBeDefined();
            expect(result.name).toBe(mockProvider.name);
        });
    });

    describe('findAll', () => {
        it('should return an array of billing providers', async () => {
            mockService.findAll.mockResolvedValue([mockProvider]);

            const result = await controller.findAll();
            expect(result).toBeInstanceOf(Array);
            expect(result[0].name).toBe(mockProvider.name);
        });
    });

    describe('findOne', () => {
        it('should return a billing provider by id', async () => {
            mockService.findById.mockResolvedValue(mockProvider);

            const result = await controller.findOne(mockProvider.id);
            expect(result).toBeDefined();
            expect(result.id).toBe(mockProvider.id);
        });
    });

    describe('update', () => {
        it('should update a billing provider', async () => {
            const dto: UpdateBillingProviderDto = {
                name: 'Updated Provider',
            };

            mockService.update.mockResolvedValue({ ...mockProvider, ...dto });

            const result = await controller.update(mockProvider.id, dto);
            expect(result).toBeDefined();
            expect(result.name).toBe(dto.name);
        });
    });

    describe('enable/disable', () => {
        it('should enable a billing provider', async () => {
            const enabledProvider = { ...mockProvider, isEnabled: true };
            mockService.setEnabled.mockResolvedValue(enabledProvider);

            const result = await controller.enable(mockProvider.id);
            expect(result.isEnabled).toBe(true);
        });

        it('should disable a billing provider', async () => {
            const disabledProvider = { ...mockProvider, isEnabled: false };
            mockService.setEnabled.mockResolvedValue(disabledProvider);

            const result = await controller.disable(mockProvider.id);
            expect(result.isEnabled).toBe(false);
        });
    });

    describe('setVisibility', () => {
        it('should update provider visibility', async () => {
            const visibleProvider = { ...mockProvider, isVisible: true };
            mockService.setVisible.mockResolvedValue(visibleProvider);

            const result = await controller.setVisibility(mockProvider.id, true);
            expect(result.isVisible).toBe(true);
        });
    });
});
```

#### Model Test Stub
```typescript
import { validate } from 'class-validator';
import { BillingProvider, BillingProviderType } from './BillingProvider';

describe('BillingProvider', () => {
    let provider: BillingProvider;

    beforeEach(() => {
        provider = new BillingProvider();
        provider.id = '123e4567-e89b-12d3-a456-426614174000';
        provider.name = 'Test Provider';
        provider.providerType = BillingProviderType.STRIPE;
        provider.isEnabled = false;
        provider.isVisible = false;
        provider.description = 'Test Description';
        provider.createdAt = new Date();
        provider.modifiedAt = new Date();
    });

    it('should be valid with all required fields', async () => {
        const errors = await validate(provider);
        expect(errors.length).toBe(0);
    });

    it('should be invalid without name', async () => {
        provider.name = undefined;
        const errors = await validate(provider);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should be invalid without provider type', async () => {
        provider.providerType = undefined;
        const errors = await validate(provider);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isEnum');
    });

    it('should be invalid with incorrect provider type', async () => {
        (provider as any).providerType = 'INVALID_TYPE';
        const errors = await validate(provider);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isEnum');
    });

    it('should allow optional description', async () => {
        provider.description = undefined;
        const errors = await validate(provider);
        expect(errors.length).toBe(0);
    });

    it('should validate boolean fields', async () => {
        provider.isEnabled = undefined;
        provider.isVisible = undefined;
        const errors = await validate(provider);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isBoolean');
    });
});
``` 
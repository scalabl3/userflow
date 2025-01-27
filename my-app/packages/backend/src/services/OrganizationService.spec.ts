import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { OrganizationService } from './OrganizationService';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { mockRepository } from '../test/setup';
import { 
    CreateOrganizationDto,
    UpdateOrganizationDto,
    ResponseOrganizationDto,
    UserState
} from '@my-app/shared';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

/**
 * Service specification for Organization entity.
 */
export interface IOrganizationService {
    /**
     * Creates a new organization.
     * @param createOrganizationDto - Data transfer object containing organization details.
     * @returns The created Organization.
     */
    createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<Organization>;

    /**
     * Retrieves an organization by its ID.
     * @param id - The UUID of the organization.
     * @returns The Organization if found, otherwise null.
     */
    getOrganizationById(id: string): Promise<Organization | null>;

    /**
     * Updates an existing organization.
     * @param id - The UUID of the organization to update.
     * @param updateOrganizationDto - Data transfer object containing updated fields.
     * @returns The updated Organization if successful, otherwise null.
     */
    updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null>;

    /**
     * Deletes an organization by its ID.
     * @param id - The UUID of the organization to delete.
     * @returns True if deletion was successful, otherwise false.
     */
    deleteOrganization(id: string): Promise<boolean>;

    /**
     * Retrieves all organizations.
     * @returns An array of Organizations.
     */
    getAllOrganizations(): Promise<Organization[]>;
}

describe('OrganizationService', () => {
    let service: OrganizationService;
    let organizationRepository: Repository<Organization>;
    let userRepository: Repository<User>;

    // Mock data setup
    const mockUser = {
        id: 'user123',
        username: 'johndoe',
        email: 'john@example.com',
        isEmailVerified: true,
        phoneNumber: '+1234567890',
        isPhoneVerified: true,
        isActive: true,
        organizationId: null, // Important for create tests
        preferences: {
            theme: 'light',
            notifications: {
                email: true,
                push: true
            }
        },
        firstname: 'John',
        lastname: 'Doe',
        displayname: 'John Doe',
        contactEmail: 'john@example.com',
        state: UserState.ACTIVE,
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
        setDefaultPreferences: () => {},
        loginCredentials: []
    } as unknown as User;

    const mockOrganization = {
        id: 'org123',
        name: 'Test Organization',
        visible: true,
        adminUser: mockUser.id,
        users: [mockUser],
        createdAt: new Date(),
        modifiedAt: new Date()
    } as unknown as Organization;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrganizationService,
                {
                    provide: getRepositoryToken(Organization),
                    useFactory: mockRepository,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<OrganizationService>(OrganizationService);
        organizationRepository = module.get<Repository<Organization>>(getRepositoryToken(Organization));
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));

        // Reset mocks
        jest.clearAllMocks();
    });

    describe('Service Setup', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
            expect(organizationRepository).toBeDefined();
            expect(userRepository).toBeDefined();
        });
    });

    describe('create', () => {
        it('should create an organization with valid admin user', async () => {
            const createDto: CreateOrganizationDto = {
                name: 'Test Org',
                visible: true,
                adminUser: mockUser.id
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(organizationRepository, 'create').mockReturnValue(mockOrganization);
            jest.spyOn(organizationRepository, 'save').mockResolvedValue(mockOrganization);
            jest.spyOn(userRepository, 'update').mockResolvedValue({
                affected: 1,
                raw: [],
                generatedMaps: []
            } as UpdateResult);

            const result = await service.create(createDto);
            
            expect(result).toEqual(mockOrganization);
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
            expect(organizationRepository.create).toHaveBeenCalledWith({
                ...createDto,
                visible: false
            });
            expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, { organizationId: mockOrganization.id });
        });

        it('should throw BadRequestException if admin user not found', async () => {
            const createDto: CreateOrganizationDto = {
                name: 'Test Org',
                visible: true,
                adminUser: 'nonexistent'
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.create(createDto))
                .rejects
                .toThrow(BadRequestException);
        });

        it('should throw BadRequestException if admin user already has an organization', async () => {
            const userWithOrg = { ...mockUser, organizationId: 'existing-org' };
            const createDto: CreateOrganizationDto = {
                name: 'Test Org',
                visible: true,
                adminUser: userWithOrg.id
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(userWithOrg as User);

            await expect(service.create(createDto))
                .rejects
                .toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return all organizations with relations', async () => {
            const organizations = [mockOrganization];
            jest.spyOn(organizationRepository, 'find').mockResolvedValue(organizations as Organization[]);

            const result = await service.findAll();
            
            expect(result).toEqual(organizations);
            expect(organizationRepository.find).toHaveBeenCalledWith({
                relations: ['users']
            });
        });

        it('should return empty array when no organizations exist', async () => {
            jest.spyOn(organizationRepository, 'find').mockResolvedValue([]);

            const result = await service.findAll();
            
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return an organization by id with relations', async () => {
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization as Organization);

            const result = await service.findOne(mockOrganization.id);
            
            expect(result).toEqual(mockOrganization);
            expect(organizationRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockOrganization.id },
                relations: ['users']
            });
        });

        it('should return null if organization not found', async () => {
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(null);

            const result = await service.findOne('nonexistent');
            
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update organization name and visibility', async () => {
            const updateDto: UpdateOrganizationDto = {
                name: 'Updated Org',
                visible: false
            };

            const updatedOrg = { 
                ...mockOrganization, 
                ...updateDto 
            };

            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization as Organization);
            jest.spyOn(organizationRepository, 'save').mockResolvedValue(updatedOrg as Organization);

            const result = await service.update(mockOrganization.id, updateDto);
            
            expect(result).toEqual(updatedOrg);
            expect(result?.name).toBe(updateDto.name);
            expect(result?.visible).toBe(updateDto.visible);
        });

        it('should return null if organization not found', async () => {
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(null);

            const result = await service.update('nonexistent', { name: 'Updated' });
            
            expect(result).toBeNull();
        });
    });

    describe('remove', () => {
        it('should delete an organization and return true', async () => {
            const orgWithoutUsers = { ...mockOrganization, users: [] };
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(orgWithoutUsers as Organization);
            jest.spyOn(organizationRepository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

            const result = await service.remove(mockOrganization.id);
            
            expect(result).toBe(true);
            expect(organizationRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockOrganization.id },
                relations: ['users']
            });
            expect(organizationRepository.delete).toHaveBeenCalledWith(mockOrganization.id);
        });

        it('should throw BadRequestException if organization has users', async () => {
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(mockOrganization as Organization);

            await expect(service.remove(mockOrganization.id))
                .rejects
                .toThrow(BadRequestException);
        });

        it('should return false if organization not found', async () => {
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(null);

            const result = await service.remove('nonexistent');
            
            expect(result).toBe(false);
            expect(organizationRepository.delete).not.toHaveBeenCalled();
        });
    });
});

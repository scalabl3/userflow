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
import { user as userMock } from '../test/__mocks__/user.mock';
import { organization as orgMock } from '../test/__mocks__/organization.mock';

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
            const userWithoutOrg = { 
                ...userMock.standard, 
                organizationId: '',
                setDefaultPreferences: () => {}
            } as User;
            const createDto: CreateOrganizationDto = {
                name: orgMock.standard.name,
                visible: true,
                adminUser: userMock.standard.id
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(userWithoutOrg);
            jest.spyOn(organizationRepository, 'create').mockReturnValue(orgMock.standard);
            jest.spyOn(organizationRepository, 'save').mockResolvedValue(orgMock.standard);
            jest.spyOn(userRepository, 'update').mockResolvedValue({
                affected: 1,
                raw: [],
                generatedMaps: []
            } as UpdateResult);

            const result = await service.create(createDto);
            
            expect(result).toEqual(orgMock.standard);
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userMock.standard.id } });
            expect(organizationRepository.create).toHaveBeenCalledWith({
                ...createDto,
                visible: false
            });
            expect(userRepository.update).toHaveBeenCalledWith(userMock.standard.id, { organizationId: orgMock.standard.id });
        });

        it('should throw BadRequestException if admin user not found', async () => {
            const createDto: CreateOrganizationDto = {
                name: orgMock.standard.name,
                visible: true,
                adminUser: 'nonexistent'
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.create(createDto))
                .rejects
                .toThrow(BadRequestException);
        });

        it('should throw BadRequestException if admin user already has an organization', async () => {
            const userWithOrg = { ...userMock.standard, organizationId: 'existing-org' };
            const createDto: CreateOrganizationDto = {
                name: orgMock.standard.name,
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
            const organizations = [orgMock.standard];
            jest.spyOn(organizationRepository, 'find').mockResolvedValue(organizations);

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
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(orgMock.standard);

            const result = await service.findOne(orgMock.standard.id);
            
            expect(result).toEqual(orgMock.standard);
            expect(organizationRepository.findOne).toHaveBeenCalledWith({
                where: { id: orgMock.standard.id },
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
                ...orgMock.standard, 
                ...updateDto 
            };

            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(orgMock.standard);
            jest.spyOn(organizationRepository, 'save').mockResolvedValue(updatedOrg);

            const result = await service.update(orgMock.standard.id, updateDto);
            
            expect(result).toEqual(updatedOrg);
            expect(organizationRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
        });

        it('should return null if organization not found', async () => {
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(null);

            const result = await service.update('nonexistent', { name: 'Updated' });
            
            expect(result).toBeNull();
        });

        it('should update admin user', async () => {
            const updateDto: UpdateOrganizationDto = {
                adminUser: 'new-admin-id'
            };

            const updatedOrg = { 
                ...orgMock.standard, 
                adminUser: 'new-admin-id'
            };

            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(orgMock.standard);
            jest.spyOn(organizationRepository, 'save').mockResolvedValue(updatedOrg);

            const result = await service.update(orgMock.standard.id, updateDto);
            
            expect(result).toEqual(updatedOrg);
            expect(organizationRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                adminUser: 'new-admin-id'
            }));
        });
    });

    describe('remove', () => {
        it('should delete an organization', async () => {
            const orgWithoutUsers = { ...orgMock.standard, users: [] };
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(orgWithoutUsers);
            jest.spyOn(organizationRepository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

            const result = await service.remove(orgMock.standard.id);
            
            expect(result).toBe(true);
            expect(organizationRepository.findOne).toHaveBeenCalledWith({
                where: { id: orgMock.standard.id },
                relations: ['users']
            });
            expect(organizationRepository.delete).toHaveBeenCalledWith(orgMock.standard.id);
        });

        it('should return false if organization not found', async () => {
            jest.spyOn(organizationRepository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

            const result = await service.remove('nonexistent');
            
            expect(result).toBe(false);
        });

        it('should throw BadRequestException when trying to delete organization with active users', async () => {
            const orgWithUsers = { 
                ...orgMock.standard, 
                users: [userMock.standard]
            };
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(orgWithUsers);

            await expect(service.remove(orgMock.standard.id))
                .rejects
                .toThrow(new BadRequestException('Cannot delete organization with active users'));
        });

        it('should return false if delete operation affected no rows', async () => {
            const orgWithoutUsers = { ...orgMock.standard, users: [] };
            jest.spyOn(organizationRepository, 'findOne').mockResolvedValue(orgWithoutUsers);
            jest.spyOn(organizationRepository, 'delete').mockResolvedValue({ affected: undefined, raw: [] });

            const result = await service.remove(orgMock.standard.id);
            
            expect(result).toBe(false);
            expect(organizationRepository.delete).toHaveBeenCalledWith(orgMock.standard.id);
        });
    });
});

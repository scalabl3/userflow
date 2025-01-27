import { CreateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/src/dtos/Organization/UpdateOrganizationDto';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationService } from './OrganizationService';
import { mockRepository } from '../test/setup';

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
    let repository: Repository<Organization>;

    const mockOrganization: Organization = {
        id: 'org123',
        name: 'Test Organization',
        visible: true,
        adminUser: 'user123',
        users: [],
        createdAt: new Date(),
        modifiedAt: new Date()
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
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
        repository = module.get<Repository<Organization>>(getRepositoryToken(Organization));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an organization', async () => {
            const createDto: CreateOrganizationDto = {
                name: 'Test Org',
                visible: true,
                adminUser: 'admin-user-id'
            };

            jest.spyOn(repository, 'create').mockReturnValue(mockOrganization);
            jest.spyOn(repository, 'save').mockResolvedValue(mockOrganization);

            const result = await service.create(createDto);
            expect(result).toEqual(mockOrganization);
            expect(repository.create).toHaveBeenCalledWith(createDto);
            expect(repository.save).toHaveBeenCalled();
        });

        it('should create an invisible organization', async () => {
            const createDto: CreateOrganizationDto = {
                name: 'Private Org',
                visible: false,
                adminUser: 'admin-user-id'
            };

            const expectedOrg = { ...mockOrganization, name: createDto.name, visible: false };
            jest.spyOn(repository, 'create').mockReturnValue(expectedOrg);
            jest.spyOn(repository, 'save').mockResolvedValue(expectedOrg);

            const result = await service.create(createDto);
            expect(result.visible).toBe(false);
        });
    });

    describe('findAll', () => {
        it('should return all organizations', async () => {
            const organizations = [mockOrganization];
            jest.spyOn(repository, 'find').mockResolvedValue(organizations);

            const result = await service.findAll();
            expect(result).toEqual(organizations);
            expect(repository.find).toHaveBeenCalled();
        });

        it('should return empty array when no organizations exist', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue([]);

            const result = await service.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return an organization by id', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockOrganization);

            const result = await service.findOne('org123');
            expect(result).toEqual(mockOrganization);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'org123' });
        });

        it('should return null if organization not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            const result = await service.findOne('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update an organization', async () => {
            const updateDto: UpdateOrganizationDto = {
                name: 'Updated Org',
                visible: false
            };

            const updatedOrg = { ...mockOrganization, ...updateDto };
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockOrganization);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedOrg);

            const result = await service.update('org123', updateDto);
            expect(result).toEqual(updatedOrg);
            expect(result?.name).toBe(updateDto.name);
            expect(result?.visible).toBe(updateDto.visible);
        });

        it('should return null if organization not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            const result = await service.update('nonexistent', { name: 'Updated' });
            expect(result).toBeNull();
        });

        it('should only update provided fields', async () => {
            const updateDto: UpdateOrganizationDto = {
                name: 'Updated Name'
            };

            const existingOrg = { ...mockOrganization };
            const updatedOrg = { 
                ...existingOrg,
                name: updateDto.name as string
            };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingOrg);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedOrg);

            const result = await service.update('org123', updateDto);
            expect(result?.name).toBe(updateDto.name);
            expect(result?.visible).toBe(existingOrg.visible);
            expect(result?.adminUser).toBe(existingOrg.adminUser);
        });
    });

    describe('remove', () => {
        it('should delete an organization', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

            const result = await service.remove('org123');
            expect(result).toBe(true);
            expect(repository.delete).toHaveBeenCalledWith('org123');
        });

        it('should return false when no organization was deleted', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

            const result = await service.remove('nonexistent');
            expect(result).toBe(false);
        });

        it('should handle undefined affected rows gracefully', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ raw: [] });

            const result = await service.remove('org123');
            expect(result).toBe(false);
        });
    });
});

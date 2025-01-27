import { CreateOrganizationDto } from '../../shared/src/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '../../shared/src/dtos/Organization/UpdateOrganizationDto';
import { Organization } from '../models/Organization';

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

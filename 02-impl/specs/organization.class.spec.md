# Organization

## Related Specifications
- **Models:** OrganizationModel, UserModel
- **APIs:** OrganizationAPI

## Constructor
```typescript
constructor(
  organizationRepository: OrganizationRepository,
  userService: UserService
)
```

## Properties

organizationRepository
- **Type:** OrganizationRepository
- **Purpose:** Manages organization data persistence
- **Access:** private

userService
- **Type:** UserService
- **Purpose:** Handles user-related operations and validation
- **Access:** private

name
- **Type:** string
- **Purpose:** Organization display name
- **Access:** public

visibility
- **Type:** boolean
- **Purpose:** Controls organization public visibility
- **Access:** public

uuid
- **Type:** string
- **Purpose:** Unique identifier for the organization
- **Access:** public readonly

adminUserUuid
- **Type:** string
- **Purpose:** UUID of the admin user
- **Access:** public readonly

createdAt
- **Type:** Date
- **Purpose:** Timestamp of organization creation
- **Access:** public readonly

modifiedAt
- **Type:** Date
- **Purpose:** Timestamp of last modification
- **Access:** public readonly

## Core Methods

create
- **Purpose:** Creates a new organization
- **Parameters:** name: string, adminUserUuid: string, visibility?: boolean
- **Returns:** Promise<Organization>
- **Errors:** ValidationError, UserNotFoundError

get
- **Purpose:** Retrieves organization by UUID
- **Parameters:** uuid: string
- **Returns:** Promise<Organization>
- **Errors:** NotFoundError

update
- **Purpose:** Updates organization details
- **Parameters:** uuid: string, updateData: Partial<OrganizationUpdateData>
- **Returns:** Promise<Organization>
- **Errors:** ValidationError, NotFoundError, UnauthorizedError

delete
- **Purpose:** Deletes an organization
- **Parameters:** uuid: string
- **Returns:** Promise<void>
- **Errors:** NotFoundError, UnauthorizedError

## Error Handling

ValidationError
- **Trigger:** Invalid organization name or properties
- **Handling:** Returns detailed validation errors

NotFoundError
- **Trigger:** Organization UUID not found
- **Handling:** Returns 404 with error message

UnauthorizedError
- **Trigger:** Non-admin user attempting modification
- **Handling:** Returns 403 with permission denied message

UserNotFoundError
- **Trigger:** Specified admin user UUID does not exist
- **Handling:** Returns 404 with user not found message

=====================================================

SCOPE BOUNDARY - Base Implementation Ends Here

=====================================================

Note: Class follows generation rules for 5K user site scale.
Complex features like organization hierarchies and multiple admins noted as future extensions.

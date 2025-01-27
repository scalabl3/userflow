# Organization

## Related Specifications
- **Models:** OrganizationModel
- **APIs:** OrganizationAPI

## Constructor
```typescript
constructor(
  organizationRepository: OrganizationRepository
)
```

Properties

organizationRepository
- **Type:** OrganizationRepository
- **Purpose:** Handles organization data persistence
- **Access:** private

id
- **Type:** UUID
- **Purpose:** Unique identifier for organization
- **Access:** readonly

name
- **Type:** string
- **Purpose:** Organization display name
- **Access:** public

visible
- **Type:** boolean
- **Purpose:** Organization visibility flag
- **Access:** public

createdAt
- **Type:** DateTime
- **Purpose:** Creation timestamp
- **Access:** readonly

modifiedAt
- **Type:** DateTime
- **Purpose:** Last modification timestamp
- **Access:** readonly

adminUser
- **Type:** UUID
- **Purpose:** Reference to admin user
- **Access:** readonly

Core Methods

create
- **Purpose:** Creates new organization
- **Parameters:** name: string, adminUser: UUID, visible: boolean
- **Returns:** Promise<Organization>
- **Errors:** ValidationError

get
- **Purpose:** Retrieves organization by ID
- **Parameters:** id: UUID
- **Returns:** Promise<Organization>
- **Errors:** NotFoundError

update
- **Purpose:** Updates organization details
- **Parameters:** id: UUID, data: OrganizationUpdateData
- **Returns:** Promise<Organization>
- **Errors:** ValidationError, NotFoundError

delete
- **Purpose:** Removes organization
- **Parameters:** id: UUID
- **Returns:** Promise<void>
- **Errors:** NotFoundError

Error Handling

ValidationError
- **Type:** Error
- **Trigger Conditions:** Invalid organization data
- **Handling Strategy:** Return validation details
- **Error Message:** "Invalid organization data"

NotFoundError
- **Type:** Error
- **Trigger Conditions:** Organization not found
- **Handling Strategy:** Return 404 status
- **Error Message:** "Organization not found"

=====================================================

SCOPE BOUNDARY - Base Implementation Ends Here

=====================================================

Note: Class follows generation rules for 5K user site scale.
Complex features noted as future extensions.

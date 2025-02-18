# Mock Design Strategy

## Core Principles

1. **Purpose-Driven Design**
   - Mocks exist to support testing, not the other way around
   - Each mock should have a clear, documented purpose
   - Avoid creating mocks "just in case"

2. **Standard Structure**
   ```typescript
   export const entity = {
     // Core instances for common test scenarios
     instances: {
       standard: createStandardEntity(),     // Base case
       withRelations: createWithRelations(), // With relationships
       empty: createEmptyEntity()           // Empty/initial state
     },

     // Common list patterns for collection testing
     lists: {
       empty: [],
       single: [instances.standard],
       multiple: [/* multiple variations */]
     },

     // DTOs for API testing
     dtos: {
       create: createDto,
       update: updateDto,
       response: responseDto
     }
   };
   ```

## Implementation Details

1. **Instance Structure**
   ```typescript
   // organization.mock.ts example
   instances: {
     standard: {
       id: core.ids.organization,
       name: 'Test Organization',
       visible: true,
       adminUserId: user.instances.standard.id,
       users: [user.instances.standard],
       subscriptionStatus: SubscriptionStatus.ACTIVE
     },
     withUsers: {
       ...standard,
       users: [user.instances.standard, user.instances.alternate]
     },
     empty: {
       id: core.ids.organization,
       name: 'Empty Organization',
       visible: false,
       adminUserId: user.instances.standard.id,
       users: []
     }
   }
   ```

2. **List Structure**
   ```typescript
   // user.mock.ts example
   lists: {
     empty: [],
     single: [instances.standard],
     multiple: [
       instances.standard,
       instances.withOrganization,
       instances.disabled
     ],
     byState: {
       active: [instances.standard],
       suspended: [instances.suspended]
     }
   }
   ```

3. **DTO Structure**
   ```typescript
   // auth.mock.ts example
   dtos: {
     create: {
       identifier: 'test@example.com',
       password: 'password123'
     },
     update: {
       isEnabled: true,
       password: 'newpassword123'
     },
     response: {
       id: core.ids.auth,
       identifier: 'test@example.com',
       isEnabled: true,
       createdAt: core.timestamps.past
     }
   }
   ```

## Factory Functions

1. **Basic Factory**
   ```typescript
   const createEntity = (
     type: 'standard' | 'withRelations' | 'empty' = 'standard',
     overrides: Partial<Entity> = {}
   ): Entity => {
     const base = instances[type];
     return { ...base, ...overrides };
   };
   ```

2. **List Factory**
   ```typescript
   const createList = (
     count: number,
     type: 'standard' | 'withRelations' = 'standard'
   ): Entity[] => {
     return Array.from({ length: count }, () => createEntity(type));
   };
   ```

## Usage Examples

1. **Service Tests**
   ```typescript
   describe('findAll', () => {
     it('returns list of entities', async () => {
       const entities = entityMock.lists.multiple;
       repository.find.mockResolvedValue(entities);
     });
   });
   ```

2. **Controller Tests**
   ```typescript
   describe('create', () => {
     it('creates new entity', async () => {
       const createDto = entityMock.dtos.create;
       const created = entityMock.instances.standard;
       service.create.mockResolvedValue(created);
     });
   });
   ```

3. **Integration Tests**
   ```typescript
   describe('complex scenarios', () => {
     it('handles related entities', async () => {
       const parent = entityMock.instances.withRelations;
       const children = entityMock.lists.byState.active;
       // Test relationships
     });
   });
   ```

## Best Practices

1. **Instance Creation**
   - Create only variations needed for tests
   - Use descriptive names for variations
   - Include relationships in relevant variations
   - Keep base instances simple

2. **List Management**
   - Create lists that match common queries
   - Use typed arrays for better IDE support
   - Consider common filtering scenarios
   - Include empty and edge cases

3. **DTO Handling**
   - Match API contracts exactly
   - Include only required fields
   - Use proper types and validation
   - Keep at root level for compatibility

4. **Documentation**
   ```typescript
   /**
    * Mock data for [Entity] testing.
    *
    * Structure:
    * - instances: Individual entity variations
    * - lists: Collection scenarios
    * - dtos: API testing support
    *
    * Examples:
    * - instances.standard: Complete entity with basic fields
    * - instances.withRelations: Entity with related data
    * - lists.byState: Filtered collections by state
    */
   ```

## Test Infrastructure Mocks

1. **Repository Mocks**
   ```typescript
   // Single source of truth for repository mocks
   const repository = mockRepository<User>();

   // Use with mock data
   repository.findOne.mockResolvedValue(userMock.instances.standard);
   ```

2. **Usage with Data Mocks**
   ```typescript
   // Combining repository mocks with data mocks
   const repository = mockRepository<User>();
   const mockUser = userMock.instances.standard;
   
   repository.findOne.mockResolvedValue(mockUser);
   ```

3. **Best Practices**
   - Use ONLY repository mocks for database operations
   - Setup validation responses consistently
   - Chain mock responses for multiple calls
   - Use data mocks from `__mocks__` directory

4. **Anti-Patterns**
   - ❌ Direct database access
   - ❌ Manual mock data creation
   - ❌ Inconsistent mock strategies
   - ❌ Missing transaction context

5. **Integration with Mock Data**
   ```typescript
   // Correct pattern
   const mockUser = userMock.instances.standard;
   repository.findOne
     .mockResolvedValueOnce(mockUser)    // validateAccess
     .mockResolvedValueOnce(null);       // uniqueness check
   
   // Anti-pattern
   const user = await db.query('SELECT * FROM users');
   ```

## Notes

- Focus on actual test scenarios
- Keep variations minimal but sufficient
- Document relationships clearly
- Use consistent naming across mocks
- Maintain type safety
- Consider test readability
- Use repository mocks consistently

## Relationship-Aware Mock Structure

1. **Mock File Organization**
   ```typescript
   // models/user.mock.ts
   export const user = {
     // Core instances (minimal dependencies)
     instances: {
       standard: createUser(...),
       alternate: createUser(...),
       
       // Relationship-aware instances
       withRelationships: {
         // Complete instance with all relationships
         complete: createUserWithFullRelationships(...),
         
         // Specific relationship contexts
         organization: {
           admin: createUserWithOrganization({ role: 'admin' }),
           member: createUserWithOrganization({ role: 'member' })
         },
         loginProvider: {
           password: createUserWithLoginProvider('password'),
           google: createUserWithLoginProvider('google')
         }
       }
     },

     // Export creators for other mocks
     creators: {
       createUser,
       createUserWithOrganization,
       createUserWithLoginProvider,
       createUserWithFullRelationships
     }
   };
   ```

2. **Entity Creation Responsibility**
   ```typescript
   // models/loginProvider.mock.ts
   export const loginProvider = {
     instances: {
       standard: createLoginProvider(...),
       withRelationships: {
         credentials: {
           single: createLoginProviderWithCredential(...),
           multiple: createLoginProviderWithCredentials(...)
         }
       }
     },
     creators: { createLoginProvider, createLoginProviderWithCredential }
   };

   // models/user.mock.ts
   import { loginProvider } from './loginProvider.mock';

   export const user = {
     instances: {
       withRelationships: {
         loginProvider: {
           password: createUserWithLoginProvider(
             loginProvider.creators.createLoginProvider(...)
           )
         }
       }
     }
   };
   ```

3. **Relationship Building Pattern**
   ```typescript
   const createEntityWithRelationship = (
     entity: Entity,
     related: RelatedEntity,
     context: BuildContext
   ): Entity => {
     // 1. Set foreign keys
     entity.relatedId = related.id;
     
     // 2. Set entity references
     entity.related = related;
     
     // 3. Set bidirectional references
     related.entities = [...(related.entities || []), entity];
     
     // 4. Apply context-specific setup
     applyContext(entity, context);
     
     return entity;
   };
   ```

4. **Full Relationship Chain Example**
   ```typescript
   // Example: User -> Organization -> BaseUser -> LoginCredential -> LoginProvider
   const createUserWithFullRelationships = (
     baseProperties: UserProperties,
     relationships: {
       organization?: Organization;
       loginProvider?: LoginProvider;
     } = {}
   ): User => {
     // 1. Create or use provided related entities
     const provider = relationships.loginProvider || loginProvider.creators.createLoginProvider();
     const organization = relationships.organization || organization.creators.createOrganization();
     
     // 2. Build relationship chain bottom-up
     const credential = createLoginCredentialWithProvider(provider);
     const baseUser = createBaseUserWithCredential(credential);
     
     // 3. Create main entity with relationships
     const user = createUser(baseProperties);
     
     // 4. Link all relationships
     linkUserRelationships(user, {
       organization,
       baseUser,
       credential,
       provider
     });
     
     return user;
   };
   ```

## Relationship Testing Guidelines

1. **Testing Individual Relationships**
   ```typescript
   it('should link user to organization', () => {
     const user = userMock.instances.withRelationships.organization.member;
     expect(user.organizationId).toBe(user.organization.id);
     expect(user.organization.users).toContain(user);
   });
   ```

2. **Testing Complex Relationships**
   ```typescript
   it('should handle full relationship chain', () => {
     const user = userMock.instances.withRelationships.complete;
     
     // Verify foreign keys
     expect(user.organizationId).toBe(user.organization.id);
     expect(user.baseUserId).toBe(user.baseUser.id);
     
     // Verify entity references
     expect(user.organization).toBeDefined();
     expect(user.baseUser).toBeDefined();
     expect(user.baseUser.loginCredential).toBeDefined();
     
     // Verify bidirectional references
     expect(user.organization.users).toContain(user);
     expect(user.baseUser.loginCredential.provider.credentials)
       .toContain(user.baseUser.loginCredential);
   });
   ```

3. **Testing Relationship Changes**
   ```typescript
   it('should handle organization transfer', () => {
     const user = userMock.instances.withRelationships.organization.member;
     const newOrg = organizationMock.instances.standard;
     
     // Before transfer
     const oldOrg = user.organization;
     expect(oldOrg.users).toContain(user);
     
     // Perform transfer
     transferUserToOrganization(user, newOrg);
     
     // After transfer
     expect(user.organizationId).toBe(newOrg.id);
     expect(user.organization).toBe(newOrg);
     expect(newOrg.users).toContain(user);
     expect(oldOrg.users).not.toContain(user);
   });
   ```

## Relationship Anti-Patterns to Avoid

1. ❌ **Incomplete Relationship Setup**
   ```typescript
   // Bad: Only setting foreign key
   user.organizationId = organization.id;
   
   // Good: Complete relationship
   user.organizationId = organization.id;
   user.organization = organization;
   organization.users.push(user);
   ```

2. ❌ **Inconsistent Foreign Keys**
   ```typescript
   // Bad: Mismatched IDs
   user.organizationId = 'one-id';
   user.organization.id = 'different-id';
   
   // Good: Consistent IDs
   user.organizationId = organization.id;
   user.organization = organization;
   ```

3. ❌ **Missing Bidirectional References**
   ```typescript
   // Bad: One-way reference
   user.organization = organization;
   
   // Good: Two-way reference
   user.organization = organization;
   organization.users.push(user);
   ```

4. ❌ **Direct Relationship Creation**
   ```typescript
   // Bad: Creating relationships in test
   const user = new User();
   const org = new Organization();
   user.organization = org;
   
   // Good: Using relationship-aware mocks
   const user = userMock.instances.withRelationships.organization.member;
   ```

## Notes on Relationship Mocks

1. **Creation Order**
   - Create leaf entities first (no dependencies)
   - Build up to more complex entities
   - Use relationship builders for consistency
   - Maintain clear dependency order

2. **Relationship Validation**
   - Verify foreign keys match references
   - Check bidirectional references
   - Validate relationship constraints
   - Test relationship changes

3. **Mock Organization**
   - Group related instances logically
   - Use descriptive relationship names
   - Keep relationship contexts clear
   - Document complex relationships

4. **Testing Support**
   - Include common relationship scenarios
   - Test relationship changes
   - Verify constraint enforcement
   - Support relationship validation 
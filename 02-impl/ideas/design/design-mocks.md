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

## Notes

- Focus on actual test scenarios
- Keep variations minimal but sufficient
- Document relationships clearly
- Use consistent naming across mocks
- Maintain type safety
- Consider test readability 
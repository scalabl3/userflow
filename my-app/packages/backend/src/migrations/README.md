# Migration System

## Entity Number Assignments

### Auth System (001-009)
- 001: LoginProvider
- 002: LoginCredential
- 003: BaseUser

### Organization System (010-019)
- 010: Organization
- 011: User

### Billing System (020-029)
- 020: BillingProvider

## Migration Numbering System
Format: `EEESNN`
- `EEE`: Entity number (000-999)
- `S`: Step type (0=core, 1=related, 2=FK, 3=indices)
- `NN`: Sequence within step (00-99)

### Step Types
0: Core entity creation
1: Related alterations
2: Foreign key relationships
3: Index additions

## Recent Changes
As of [DATE], we've adopted a new migration numbering system. The old 3-digit sequential numbers have been replaced with a 6-digit semantic numbering system. This allows for:
- Better organization by entity
- Clear step type identification
- Room for insertion of new migrations
- Logical grouping of related changes

### Migration Mapping
Old -> New:
```
Auth System:
001 -> 001000 (LoginProvider)
002 -> 002000 (LoginCredential)
004 -> 003000 (BaseUser)
005 -> 003200 (BaseUser FK)

Organization System:
006 -> 010000 (Organization)
007 -> 011000 (User)
008 -> 011200 (User FK)

Billing System:
009 -> 020000 (BillingProvider)
```

## Best Practices
1. Always use the next available entity number in the appropriate range
2. Document new entity numbers in this README
3. Use step types consistently
4. Leave room for future migrations
5. Keep migrations atomic and focused 
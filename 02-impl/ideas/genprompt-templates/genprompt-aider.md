# Generation Instructions

## Overview
This template provides the common setup and command structure for generating entity code using aider. It should be used as the base template (0-aider.md) for all entity types (Standalone, Has-A, Is-A).

## File Location
Generate file at: `02-impl/ideas/genprompt/<EntityName>/0-aider.md`

## AI Instructions
1. Copy this template to the target location
2. Replace `<EntityName>` with the actual entity name
3. Replace placeholders in the command line with the appropriate file paths
4. Create empty target files using touch command (provided below)
5. Ensure all referenced files exist before running aider

## Generation Template

### Touch Commands - Create Empty Target Files
```bash
# Foundation Layer
touch my-app/packages/backend/src/models/<EntityName>.ts
touch my-app/packages/backend/src/migrations/<timestamp>_<order>-Create<EntityName>.ts
touch my-app/packages/backend/src/models/<EntityName>.spec.ts

# Data Transfer Layer
touch my-app/packages/shared/src/dtos/<EntityName>/Create<EntityName>Dto.ts
touch my-app/packages/shared/src/dtos/<EntityName>/Update<EntityName>Dto.ts
touch my-app/packages/shared/src/dtos/<EntityName>/Response<EntityName>Dto.ts

# Service Layer
touch my-app/packages/backend/src/services/<EntityName>Service.ts
touch my-app/packages/backend/src/services/<EntityName>Service.spec.ts

# Controller Layer
touch my-app/packages/backend/src/controllers/<EntityName>Controller.ts
touch my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts
```

### Aider Command Line - Foundation Layer - Model Migration Model-Tests
```bash
cd '/Users/jasdeep/Library/Mobile Documents/com~apple~CloudDocs/Cursor/UserFlow/' && rm -rf .aider.tags.cache.v3 && 
aider --no-auto-commits --architect --model sonnet \
  02-impl/ideas/design/design-models.md \
  my-app/packages/backend/src/utils/constants.ts \
  my-app/packages/backend/src/utils/validators.ts \
  my-app/packages/backend/src/utils/helpers.ts \
  my-app/packages/backend/src/models/Organization.ts \
  my-app/packages/backend/src/migrations/1737964200-001100-CREATE-Organization.ts \
  my-app/packages/backend/src/models/Organization.spec.ts \
  my-app/packages/backend/src/models/<EntityName>.ts \
  my-app/packages/backend/src/migrations/<timestamp>_<order>-Create<EntityName>.ts \
  my-app/packages/backend/src/models/<EntityName>.spec.ts
```

### Aider Command Line - Data Transfer Layer - DTOs and Mocks
```bash
cd '/Users/jasdeep/Library/Mobile Documents/com~apple~CloudDocs/Cursor/UserFlow/' && rm -rf .aider.tags.cache.v3 && 
aider --no-auto-commits --architect --model sonnet \
  02-impl/ideas/design/design-dto.md \
  my-app/packages/backend/src/models/Organization.ts \
  my-app/packages/shared/src/dtos/Organization/CreateOrganizationDto.ts \
  my-app/packages/shared/src/dtos/Organization/UpdateOrganizationDto.ts \
  my-app/packages/shared/src/dtos/Organization/ResponseOrganizationDto.ts \
  my-app/packages/backend/src/models/<EntityName>.ts \
  my-app/packages/shared/src/dtos/<EntityName>/Create<EntityName>Dto.ts \
  my-app/packages/shared/src/dtos/<EntityName>/Update<EntityName>Dto.ts \
  my-app/packages/shared/src/dtos/<EntityName>/Response<EntityName>Dto.ts
```

### Aider Command Line - Service Layer - Service and Tests
```bash
cd '/Users/jasdeep/Library/Mobile Documents/com~apple~CloudDocs/Cursor/UserFlow/' && rm -rf .aider.tags.cache.v3 && 
aider --no-auto-commits --architect --model sonnet \
  02-impl/ideas/design/design-services.md \
  my-app/packages/backend/src/models/Organization.ts \
  my-app/packages/shared/src/dtos/Organization/CreateOrganizationDto.ts \
  my-app/packages/shared/src/dtos/Organization/UpdateOrganizationDto.ts \
  my-app/packages/shared/src/dtos/Organization/ResponseOrganizationDto.ts \
  my-app/packages/backend/src/services/OrganizationService.ts \
  my-app/packages/backend/src/services/OrganizationService.spec.ts \
  my-app/packages/backend/src/models/<EntityName>.ts \
  my-app/packages/shared/src/dtos/<EntityName>/Create<EntityName>Dto.ts \
  my-app/packages/shared/src/dtos/<EntityName>/Update<EntityName>Dto.ts \
  my-app/packages/shared/src/dtos/<EntityName>/Response<EntityName>Dto.ts \
  my-app/packages/backend/src/services/<EntityName>Service.ts \
  my-app/packages/backend/src/services/<EntityName>Service.spec.ts
```

### Aider Command Line - Controller Layer - Controller and Tests
```bash
cd '/Users/jasdeep/Library/Mobile Documents/com~apple~CloudDocs/Cursor/UserFlow/' && rm -rf .aider.tags.cache.v3 && 
aider --no-auto-commits --architect --model sonnet \
  02-impl/ideas/design/design-controllers.md \
  my-app/packages/backend/src/models/Organization.ts \
  my-app/packages/shared/src/dtos/Organization/CreateOrganizationDto.ts \
  my-app/packages/shared/src/dtos/Organization/UpdateOrganizationDto.ts \
  my-app/packages/shared/src/dtos/Organization/ResponseOrganizationDto.ts \
  my-app/packages/backend/src/services/OrganizationService.ts \
  my-app/packages/backend/src/controllers/OrganizationController.ts \
  my-app/packages/backend/src/controllers/OrganizationController.spec.ts \
  my-app/packages/backend/src/models/<EntityName>.ts \
  my-app/packages/shared/src/dtos/<EntityName>/Create<EntityName>Dto.ts \
  my-app/packages/shared/src/dtos/<EntityName>/Update<EntityName>Dto.ts \
  my-app/packages/shared/src/dtos/<EntityName>/Response<EntityName>Dto.ts \
  my-app/packages/backend/src/services/<EntityName>Service.ts \
  my-app/packages/backend/src/controllers/<EntityName>Controller.ts \
  my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts
```

### Aider Tree Command (don't change)
```bash
/run tree my-app/packages -I node_modules -I dist
```

### File Path Structure
The following paths should exist and be included in the command line:
- Model: `my-app/packages/backend/src/models/<EntityName>.ts`
- Service: `my-app/packages/backend/src/services/<EntityName>Service.ts`
- Controller: `my-app/packages/backend/src/controllers/<EntityName>Controller.ts`
- DTOs: 
  - `my-app/packages/shared/src/dtos/<EntityName>/Create<EntityName>Dto.ts`
  - `my-app/packages/shared/src/dtos/<EntityName>/Update<EntityName>Dto.ts`
  - `my-app/packages/shared/src/dtos/<EntityName>/Response<EntityName>Dto.ts`
- Migration: `my-app/packages/backend/src/migrations/<timestamp>_<order>-Create<EntityName>.ts`
- Tests:
  - `my-app/packages/backend/src/models/<EntityName>.spec.ts`
  - `my-app/packages/backend/src/services/<EntityName>Service.spec.ts`
  - `my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`

### Notes
- This template is used in conjunction with the specific MDM, SDT, and CTT templates
- The aider command should be run after all necessary files are created
- The tree command helps aider understand the project structure
- File paths should follow the established naming conventions
- All files should exist (can be empty) before running aider
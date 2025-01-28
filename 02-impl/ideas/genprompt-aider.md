# Generation Instructions

## Overview
This template provides the common setup and command structure for generating entity code using aider. It should be used as the base template (0-aider.md) for all entity types (Standalone, Has-A, Is-A).

## File Location
Generate file at: `02-impl/ideas/genprompt/<EntityName>/0-aider.md`

## Instructions
1. Copy this template to the target location
2. Replace `<EntityName>` with the actual entity name
3. Replace `{ }` in the command line with the appropriate file paths
4. Ensure all referenced files exist before running aider

## Generation Template

### Aider Command Line
```bash
gouserflow && rm -rf .aider.tags.cache.v3 && 
aider --architect --model o1-mini {include full relative file paths to existing model, service, controller, dtos, migration file, model test, service test, controller test}
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
- Migration: `my-app/packages/backend/src/migrations/<timestamp>_<order>_Create<EntityName>.ts`
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


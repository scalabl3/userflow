# Generation Instructions

## Overview
This template provides the common setup and command structure for generating the BillingProvider entity code using aider. BillingProvider represents the supported payment providers in the system (e.g., Stripe, Apple Pay, Google Pay, PayPal).

## File Location
Generate file at: `02-impl/ideas/genprompt/BillingProvider/0-aider.md`

## Instructions
1. Copy this template to the target location
2. Replace `<EntityName>` with BillingProvider
3. Replace `{ }` in the command line with the appropriate file paths
4. Ensure all referenced files exist before running aider

## Generation Template

### Aider Command Line
```bash
gouserflow && rm -rf .aider.tags.cache.v3 && 
aider --no-auto-commits --architect --model sonnet \
my-app/packages/shared/src/enums/BillingProviderType.ts \
my-app/packages/backend/src/models/BillingProvider.ts \
my-app/packages/backend/src/services/BillingProviderService.ts \
my-app/packages/backend/src/controllers/BillingProviderController.ts \
my-app/packages/shared/src/dtos/BillingProvider/CreateBillingProviderDto.ts \
my-app/packages/shared/src/dtos/BillingProvider/UpdateBillingProviderDto.ts \
my-app/packages/shared/src/dtos/BillingProvider/ResponseBillingProviderDto.ts \
my-app/packages/backend/src/migrations/1738084609_009-CreateBillingProvider.ts \
my-app/packages/backend/src/models/BillingProvider.spec.ts \
my-app/packages/backend/src/services/BillingProviderService.spec.ts \
my-app/packages/backend/src/controllers/BillingProviderController.spec.ts
```

### Aider Tree Command (don't change)
```bash
/run tree my-app/packages -I node_modules -I dist
```

### File Path Structure
The following paths should exist and be included in the command line:
- Enum: `my-app/packages/shared/src/enums/BillingProviderType.ts`
- Model: `my-app/packages/backend/src/models/BillingProvider.ts`
- Service: `my-app/packages/backend/src/services/BillingProviderService.ts`
- Controller: `my-app/packages/backend/src/controllers/BillingProviderController.ts`
- DTOs: 
  - `my-app/packages/shared/src/dtos/BillingProvider/CreateBillingProviderDto.ts`
  - `my-app/packages/shared/src/dtos/BillingProvider/UpdateBillingProviderDto.ts`
  - `my-app/packages/shared/src/dtos/BillingProvider/ResponseBillingProviderDto.ts`
- Migration: `my-app/packages/backend/src/migrations/1738084609-009-CreateBillingProvider.ts`
- Tests:
  - `my-app/packages/backend/src/models/BillingProvider.spec.ts`
  - `my-app/packages/backend/src/services/BillingProviderService.spec.ts`
  - `my-app/packages/backend/src/controllers/BillingProviderController.spec.ts`

### Notes
- This template is used in conjunction with the specific MDM, SDT, and CTT templates
- The aider command should be run after all necessary files are created
- The tree command helps aider understand the project structure
- File paths should follow the established naming conventions
- All files should exist (can be empty) before running aider 
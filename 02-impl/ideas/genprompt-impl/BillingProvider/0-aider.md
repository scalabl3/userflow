# Generation Instructions for BillingProvider

## Overview
BillingProvider represents a payment provider supported by the system. Key aspects:
- Each provider has a unique name (e.g., Stripe, Apple Pay, Google Pay, PayPal)
- Providers can be enabled/disabled for system-wide use
- Providers can be made visible/invisible to users
- Provider type is an enum of supported providers
- Provider requires configuration and credentials (to be expanded later)
- Similar pattern to LoginProvider in terms of usage and management

## File Location
Generated at: `02-impl/ideas/genprompt/BillingProvider/0-aider.md`

## AI Instructions
1. Copy this template to the target location
2. Replace placeholders with actual file paths in aider cmdline
3. Ensure all referenced files exist before running aider

## Generation Template

### Aider Command Line
```bash
gouserflow && rm -rf .aider.tags.cache.v3 && 
aider --no-auto-commits --architect --model sonnet \
my-app/packages/backend/src/models/BillingProvider.ts \
my-app/packages/backend/src/services/BillingProviderService.ts \
my-app/packages/backend/src/controllers/BillingProviderController.ts \
my-app/packages/shared/src/dtos/BillingProvider/CreateBillingProviderDto.ts \
my-app/packages/shared/src/dtos/BillingProvider/UpdateBillingProviderDto.ts \
my-app/packages/shared/src/dtos/BillingProvider/ResponseBillingProviderDto.ts \
my-app/packages/backend/src/migrations/1738084609-009-CREATE-BillingProvider.ts \
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
- File paths follow the established naming conventions
- All files should exist (can be empty) before running aider 
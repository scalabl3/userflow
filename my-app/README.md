# My App

A modern monorepo application with TypeScript, following strict conventions and best practices.

## Project Structure

```
my-app/
├─ packages/
│  ├─ backend/        # API and business logic
│  ├─ frontend/       # UI components and pages
│  └─ shared/         # Shared types and utilities
├─ docs/              # Documentation
├─ tools/             # Build and deployment scripts
└─ .github/           # GitHub workflows
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development servers:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm run test
   ```

## Development Guidelines

- Follow TypeScript strict mode
- Write tests for all new features
- Follow the established naming conventions
- Keep packages modular and maintain clear boundaries
- Document all public functions and components

## Authentication Configuration

The application uses a centralized authentication configuration file for managing various authentication methods including OAuth, Apple Sign In, password policies, phone authentication, magic links, and biometric authentication.

### Setup

1. Copy the example configuration file:
   ```bash
   cp auth.config.json.example auth.config.json
   ```

2. Update the configuration values in `auth.config.json` with your authentication credentials and settings:

   - OAuth Providers (Google, GitHub):
     - Set `clientId` and `clientSecret` for each provider
     - Update `redirectUri` if needed

   - Apple Sign In:
     - Configure `clientId`, `teamId`, and `keyId`
     - Set path to your Apple private key in `privateKeyPath`

   - Phone Authentication (Twilio):
     - Set `accountSid`, `authToken`, and `fromNumber`

   - Other Settings:
     - Adjust password policy settings
     - Configure magic link email templates
     - Set biometric authentication parameters

### Security Notes

- The `auth.config.json` file is ignored by git to prevent committing sensitive credentials
- Use environment-specific configurations for different deployments
- Consider using environment variables for sensitive values in production
- Keep your Apple private key secure and outside the source code

### Configuration Structure

```typescript
{
    "oauth": {
        "google": { /* Google OAuth settings */ },
        "github": { /* GitHub OAuth settings */ }
    },
    "apple": { /* Apple Sign In settings */ },
    "password": { /* Password policy settings */ },
    "phone": { /* Phone authentication settings */ },
    "magicLink": { /* Magic link settings */ },
    "biometric": { /* Biometric authentication settings */ }
}
```

For detailed configuration options, refer to `auth.config.json.example`.

## License

MIT 
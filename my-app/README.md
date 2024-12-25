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

## License

MIT 
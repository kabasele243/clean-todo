# Clean Architecture TypeScript Application

A TypeScript application implementing Clean Architecture principles with DynamoDB as the database.

## Architecture Overview

The application follows Clean Architecture with four main layers:

- **Entities**: Core business objects
- **Use Cases**: Application business rules
- **Interface Adapters**: Controllers and gateways
- **Frameworks**: External frameworks and tools

### Directory Structure

```
src/
├── domain/          # Entities and business rules
├── application/     # Use cases and ports
├── infrastructure/  # Frameworks, database, and external services
└── interfaces/      # Controllers and presenters
```

## Technologies

- TypeScript
- AWS DynamoDB
- AWS SDK v3
- Node.js

## Prerequisites

- Node.js >= 20
- AWS Account with DynamoDB access
- AWS CLI configured

## Installation

```bash
npm install
```

## Configuration

1. Create `.env` file:
```
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DYNAMODB_TABLE=your-table-name
```

## Development

```bash
npm run dev     # Start development server
npm run build   # Build production version
npm run test    # Run tests
```

## Testing

- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`

## DynamoDB Schema

Document your table schemas here:

```typescript
interface YourEntity {
  pk: string;      // Partition Key
  sk: string;      // Sort Key
  // other attributes
}
```

## API Documentation

Document your API endpoints here.

## Deployment

```bash
npm run build
npm run deploy
```

## Clean Architecture Implementation

### Domain Layer
- Contains enterprise business rules
- No dependencies on external frameworks
- Pure TypeScript interfaces and classes

### Application Layer
- Contains application business rules
- Implements use cases
- Defines ports (interfaces) for external dependencies

### Infrastructure Layer
- Contains DynamoDB implementations
- Handles external services
- Implements ports defined in application layer

### Interface Layer
- Contains controllers and presenters
- Handles HTTP requests/responses
- Transforms data between layers

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

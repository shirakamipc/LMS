# LMS Backend

A NestJS backend application with PostgreSQL and Prisma ORM.

## Features

- 🚀 NestJS framework
- 🗄️ PostgreSQL database with Prisma ORM
- 🔧 Environment-based configuration
- 🏥 Health checks with database connectivity
- 🐳 Docker support
- 📦 pnpm package manager

## Prerequisites

- Node.js 18+
- pnpm
- Docker (for database)

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

3. **Start PostgreSQL with Docker:**
   ```bash
   docker-compose up -d postgres
   ```

4. **Run database migrations:**
   ```bash
   pnpm prisma:migrate 
   pnpm prisma migrate dev
   ```

5. **Seed the database:**
   ```bash
   pnpm db:seed
   ```

6. **Start the development server:**
   ```bash
   pnpm start:dev
   ```

## Available Scripts

### Application
- `pnpm start:dev` - Start development server with hot reload
- `pnpm start:prod` - Start production server
- `pnpm build` - Build the application
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests

### Database
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm db:reset` - Reset database (⚠️ destructive)
- `pnpm db:seed` - Seed database with sample data

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check (includes database connectivity)
- `GET /users` - List all users

## Database Schema

The application includes a `User` model with the following fields:
- `id` - Unique identifier (CUID)
- `email` - Email address (unique)
- `name` - User's name (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Docker

### Database Only
```bash
docker-compose up -d postgres
```

### Full Application
```bash
# Build and run the application
docker build -t lms-backend .
docker run -p 3000:3000 --env-file .env lms-backend
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `LOG_LEVEL` | Logger level | `log` |

## Development

### Project Structure
```
src/
├── config/          # Configuration files
├── health/          # Health check module
├── prisma/          # Prisma service and module
├── users/           # Users module
├── app.module.ts    # Main application module
└── main.ts          # Application entry point
```

### Adding New Features

1. Create a new module: `nest g module feature-name`
2. Add Prisma models to `prisma/schema.prisma`
3. Run migrations: `pnpm prisma:migrate`
4. Generate client: `pnpm prisma:generate`

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker-compose ps`
- Check DATABASE_URL in `.env`
- Verify database exists and is accessible

### Prisma Issues
- Regenerate client: `pnpm prisma:generate`
- Reset database: `pnpm db:reset`
- Check schema syntax: `pnpm prisma validate`

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Run linting before committing: `pnpm lint`
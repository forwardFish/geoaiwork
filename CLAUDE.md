# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
- `npm run dev` - Start development server with database and Next.js with Turbopack
- `npm run dev:next` - Start only Next.js development server
- `npm run dev:spotlight` - Start Sentry Spotlight for local error monitoring

### Database Operations
- `npm run db:generate` - Generate new database migrations after schema changes
- `npm run db:studio` - Open Drizzle Studio at https://local.drizzle.studio
- `npm run db-server:file` - Start PGlite server with persistent file database (local.db)
- `npm run db-server:memory` - Start PGlite server with in-memory database

### Testing
- `npm run test` - Run all unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run storybook:test` - Run Storybook component tests

### Blog Generation
- `npm run blog:new` - Generate new blog article using template
- `npm run blog:sumif` - Generate SUMIF function tutorial
- `npm run blog:vlookup` - Generate VLOOKUP function tutorial
- `npm run blog:countif` - Generate COUNTIF function tutorial
- `npm run blog:index-match` - Generate INDEX/MATCH function tutorial

### Code Quality
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix auto-fixable linting issues
- `npm run check:types` - Type check the entire project
- `npm run check:deps` - Find unused dependencies with Knip
- `npm run check:i18n` - Validate i18n translations

### Build & Production
- `npm run build` - Production build with memory database
- `npm run build:next` - Build Next.js application only
- `npm run start` - Start production server
- `npm run build-stats` - Build with bundle analyzer

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15+ with App Router and Turbopack
- **Language**: TypeScript with strict configuration
- **Database**: PostgreSQL with Drizzle ORM (PGlite for local development)
- **Authentication**: Clerk with multi-factor auth support
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest (unit/browser) + Playwright (E2E) + Storybook
- **Security**: Arcjet (bot protection, WAF)
- **Monitoring**: Sentry with Spotlight for development
- **Analytics**: PostHog
- **Internationalization**: next-intl
- **AI/Data Processing**: Custom Excel processing engine with DuckDB

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   └── [locale]/          # i18n route structure
│       ├── (auth)/        # Protected routes (dashboard, profile)
│       └── (marketing)/   # Public routes (home, about, tools, blog)
├── components/            # Reusable React components
│   ├── blog/             # Blog-specific components
│   ├── ui/               # UI component library
│   └── analytics/        # Analytics components
├── libs/                 # Third-party integrations and configs
├── lib/                  # Core business logic and utilities
│   ├── blog/             # Blog content management
│   └── preview-engine.ts # Excel processing preview engine
├── models/               # Database schema (Drizzle ORM)
├── styles/               # Global styles and Tailwind config
├── templates/            # Page templates
├── types/                # TypeScript type definitions
├── utils/                # Utility functions (Excel operations, AI service)
└── validations/          # Zod schemas for form validation
```

### Key Files & Configuration

#### Database
- **Schema**: `src/models/Schema.ts` - Drizzle ORM table definitions
- **Connection**: `src/libs/DB.ts` - Database connection with auto-migrations
- **Migrations**: `migrations/` directory - Auto-generated migration files

#### Authentication & Security
- **Middleware**: `src/middleware.ts` - Handles auth, i18n routing, and Arcjet security
- **Auth Routes**: Protected routes use `/dashboard(.*)` pattern
- **Security**: Arcjet integration with bot detection and WAF protection

#### Environment & Configuration
- **Environment**: `src/libs/Env.ts` - Type-safe environment variables with T3 Env
- **i18n**: `src/libs/I18nRouting.ts` - Internationalization routing configuration

### Development Workflow

#### Database Schema Changes
1. Update `src/models/Schema.ts`
2. Run `npm run db:generate` to create migration
3. Migration applies automatically on next database interaction

#### Testing Strategy
- **Unit Tests**: `.test.ts` files alongside source code
- **Component Tests**: `.test.tsx` files with Vitest browser mode
- **E2E Tests**: `.spec.ts` and `.e2e.ts` files in `tests/` directory
- **Storybook**: `.stories.tsx` files for component documentation

#### Code Quality Tools
- **ESLint**: Antfu config with React, Next.js, accessibility, and Tailwind rules
- **TypeScript**: Strict mode with advanced type checking
- **Commitizen**: Conventional commit format with `npm run commit`

### Important Notes

#### Local Development
- Uses PGlite for local PostgreSQL database (no Docker required)
- Sentry Spotlight automatically available at http://localhost:8969
- Database migrations run automatically - no manual intervention needed

#### Environment Setup
Required environment variables:
- `CLERK_SECRET_KEY` & `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Authentication
- `DATABASE_URL` - PostgreSQL connection string
- `ARCJET_KEY` - Security protection (optional in development)
- `NEXT_PUBLIC_POSTHOG_KEY` & `NEXT_PUBLIC_POSTHOG_HOST` - Analytics (optional)
- `BETTER_STACK_SOURCE_TOKEN` - Logging (optional)

#### Testing Configuration
- Unit tests run in Node.js environment
- Component tests use Playwright browser mode
- E2E tests automatically start development server with in-memory database

#### Route Structure
- Authentication routes: `/(auth)` group with Clerk protection
- Marketing routes: `/(marketing)` group for public pages
- All routes support internationalization via `[locale]` dynamic segment

#### Blog Generation Workflow
This project includes automated blog generation for Excel tutorial content:
- Templates located in `content/blog/_TEMPLATE.mdx`
- Generate articles using `npm run blog:new [function] [date]`
- Supports Excel functions: SUMIF, VLOOKUP, COUNTIF, INDEX/MATCH
- See `BLOG_WORKFLOW.md` for detailed workflow instructions

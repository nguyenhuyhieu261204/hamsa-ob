# Strategic Strategy App - QWEN Context

## Project Overview

This is a Shopify application built using React Router, forked from the official Shopify Remix app template. The app serves as a template for building Shopify apps with modern technologies and best practices.

### Key Technologies

- **Framework**: React Router v7.9.3 (converted from Remix)
- **Backend**: Node.js with Shopify's app framework
- **Database**: Prisma ORM with SQLite (default, production-ready for single instances)
- **UI Components**: Shopify Polaris web components
- **API**: Shopify Admin GraphQL API
- **Type System**: TypeScript
- **Build System**: Vite

### Architecture

- **Frontend**: React Router for routing and navigation
- **Backend**: Node.js server with Shopify authentication
- **Database**: Prisma with SQLite for session storage
- **Authentication**: Shopify's OAuth flow with session management

## Project Structure

```
├── .shopify/              # Shopify CLI configuration
├── app/                   # Main application source code
│   ├── routes/            # React Router routes
│   └── shopify.server.ts  # Shopify authentication setup
├── extensions/            # App extensions (if any)
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── shopify.app.toml       # Shopify app configuration
├── shopify.web.toml       # Shopify web configuration
└── ...
```

## Building and Running

### Prerequisites

1. **Node.js** (>=20.19 <22 || >=22.12)
2. **Shopify CLI** installed globally
3. **Shopify Partner Account**
4. **Development Store**

### Local Development

```bash
# Install Shopify CLI globally
npm install -g @shopify/cli@latest

# Initialize the app (if not already done)
shopify app init --template=https://github.com/Shopify/shopify-app-template-react-router

# Start local development
npm run dev
# or
shopify app dev
```

### Environment Setup

The app requires the following environment variables:

- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SHOPIFY_APP_URL`
- `SCOPES`
- `SHOPIFY_APP_URL`

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm run start

# Or run setup and start in one command (for Docker)
npm run docker-start
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Deploy database migrations
npx prisma migrate deploy

# Or run the setup script (generates and deploys)
npm run setup
```

## Development Conventions

### Authentication

All routes that need to access Shopify admin APIs must authenticate first:

```javascript
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  // ... rest of your loader logic
};
```

### GraphQL Queries

The app uses Shopify's Admin GraphQL API. Example usage:

```javascript
const response = await admin.graphql(`
  {
    products(first: 25) {
      nodes {
        title
        description
      }
    }
  }`);
```

### UI Components

The app uses Shopify Polaris web components for the interface:

- Use `<s-*>` prefixed components (e.g., `<s-page>`, `<s-button>`)
- Components are automatically loaded from the Shopify CDN

### Routing

- React Router is used for all routing
- Routes are automatically generated from the `app/routes/` directory
- App routes typically start with `/app/`

## Key Features

### Authentication Flow

- OAuth 2.0 with Shopify
- Session management with Prisma
- Automatic token refresh
- Embedded app support

### Webhook Handling

- Configured to handle `app/uninstalled` and `app/scopes_update` events
- Webhooks registered via `shopify.app.toml`
- Example webhook handler in `app/routes/webhooks.app.uninstalled.tsx`

### Database

- Prisma ORM for database operations
- SQLite by default (production-ready for single instances)
- Session storage for OAuth tokens
- Migrations system for schema changes

## Deployment

### Environment Variables

Required for production:

- `NODE_ENV=production`
- Shopify API credentials
- Database connection strings (for non-SQLite databases)

### Deployment Options

1. **Docker**: Containerized deployment with the provided Dockerfile
2. **Google Cloud Run**: Detailed tutorial available in documentation
3. **Fly.io**: Quick deployment with Fly.io CLI
4. **Render**: Docker-based deployment
5. **Manual hosting**: General hosting with Node.js runtime

### Database for Production

For production applications that need to scale beyond a single instance, consider:

- PostgreSQL (Digital Ocean, AWS Aurora, Google Cloud SQL)
- MySQL (Digital Ocean, Planet Scale, AWS Aurora, Google Cloud SQL)
- MongoDB (Digital Ocean, MongoDB Atlas)
- Redis (Digital Ocean, Amazon MemoryDB)

## Troubleshooting

### Common Issues

1. **Database tables don't exist**: Run `npm run setup` to create database tables
2. **Embedded app navigation**: Use `<Link>` from React Router or `@shopify/polaris`, not `<a>` tags
3. **JWT token expiration**: Ensure system clock is synchronized
4. **Webhook validation errors**: Admin-created webhooks fail HMAC validation; use app-specific webhooks in TOML files

### Development Notes

- Use `redirect` from `authenticate.admin`, not from React Router directly
- When triggering webhooks via CLI, admin object will be undefined (expected behavior)
- Use `useSubmit` from React Router for form submissions in embedded apps

# Best Practices Guide for Shopify React Router App

## 1. React Router File-Based Routing

### File Naming Convention
- Use dot notation for nested routes: `app.{routeName}.tsx` → `/app/{routeName}`
- Use `app.{routeName}._index.tsx` for index routes within a section
- Use `app.{routeName}.{subRoute}.tsx` for subroutes: `app.bundle.new.tsx` → `/app/bundle/new`

### Route Structure
- Always include loader function for data fetching and authentication
- Use Shopify authentication: `await authenticate.admin(request)`
- Include headers function with proper error boundaries
- Implement ErrorBoundary using `boundary.error(useRouteError())`

## 2. Authentication and Security

### Route Authentication
- All admin routes must use authentication in the loader
```typescript
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};
```

### Webhook Authentication
- Use webhook authentication for webhook routes: `await authenticate.webhook(request)`

## 3. TypeScript Usage

### Type Safety
- Always specify types for function parameters and return values
- Use specific interfaces instead of `any`
- Import and use types from relevant libraries

### Example: Product Interface
```typescript
interface Product {
  id: string;
  title: string;
  handle?: string;
  productType?: string;
  variants?: Array<{
    id: string;
    price?: string;
  }>;
}
```

## 4. Shopify Polaris Web Components

### Component Usage
- Use Shopify Polaris web components with `s-*` prefix
- Maintain consistent UI with other Shopify apps
- Use semantic component names

### Common Components
- `<s-page>` for page containers
- `<s-section>` for section groupings
- `<s-button>` for actions
- `<s-text-field>`, `<s-text-area>`, `<s-number-field>` for forms
- `<s-stack>`, `<s-box>` for layout

## 5. State Management

### React State
- Use `useState` for local component state
- Use `useEffect` for side effects
- Keep state types specific when possible

### Form Handling
- Use proper form validation
- Handle loading states appropriately
- Provide user feedback for actions

## 6. Database Schema with Prisma

### Model Design
- Use descriptive field names
- Include proper relationships
- Add appropriate indexes
- Follow naming conventions (camelCase for fields)

### Example Model
```prisma
model Bundle {
  id          String   @id @default(cuid())
  title       String
  description String?
  shop        String   // The shop this bundle belongs to
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  isPublished Boolean  @default(false)
  bundlePrice Float?   // The special bundle price
  originalPrice Float? // The combined original price of all items

  // Relationships
  bundleItems BundleItem[]
}
```

## 7. Prisma Client Usage

### Queries
- Use proper typing with PrismaClient
- Handle errors appropriately
- Use transactions for complex operations
- Implement proper error handling

### Example Query
```typescript
const bundles = await prisma.bundle.findMany({
  where: { shop },
  include: { bundleItems: true }
});
```

## 8. Shopify App Bridge

### Resource Picker
- Use `useAppBridge` hook to get app instance
- Implement proper error handling
- Use the correct typing from App Bridge
- Follow the official documentation for implementation

### Example Resource Picker Usage
```typescript
const handleResourcePicker = async () => {
  if (!shopify) return;

  const selected = await shopify.resourcePicker({
    type: "product",
    multiple: true,
    action: "select",
    filter: {
      variants: true,
    },
  });

  if (selected) {
    setSelectedProducts(selected);
  }
};
```

## 9. Error Handling

### Client-Side Errors
- Implement proper error boundaries
- Handle network errors gracefully
- Provide meaningful error messages to users
- Log errors appropriately

### Server-Side Errors
- Use proper HTTP status codes
- Handle authentication errors
- Implement proper fallbacks

## 10. UI/UX Best Practices

### Consistency
- Maintain consistent design language with Shopify
- Use appropriate spacing and typography
- Follow accessibility guidelines

### Responsive Design
- Ensure components work on different screen sizes
- Test in embedded app context

### Loading States
- Provide loading indicators for async operations
- Handle skeleton states appropriately

## 11. Testing

### Component Testing
- Write unit tests for complex components
- Test user interactions
- Mock API calls appropriately

### End-to-End Testing
- Test critical user flows
- Verify authentication flows
- Test data persistence

## 12. Performance

### Code Splitting
- Use code splitting for large components
- Lazy load non-critical components

### Data Fetching
- Optimize database queries
- Use proper indexing
- Implement caching where appropriate

## 13. Code Organization

### File Structure
```
app/
├── routes/         # Route components
├── components/     # Reusable UI components
├── constants/      # Application constants
├── utils/          # Utility functions
├── hooks/          # Custom React hooks
├── services/       # API services
├── types/          # TypeScript definitions
├── assets/         # Static assets
└── ... other files
```

### Naming Conventions
- Use PascalCase for component names
- Use camelCase for functions and variables
- Use UPPER_SNAKE_CASE for constants
- Keep file names descriptive and concise
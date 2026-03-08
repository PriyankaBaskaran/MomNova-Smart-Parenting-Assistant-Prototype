# Smart Parenting Assistant - Integration Guide

## Overview
Complete React app structure with routing, state management, and API integration for the Smart Parenting Assistant.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- React Hook Form + Zod (form validation)
- Axios (API client)
- Tailwind CSS + shadcn/ui
- Sonner (toast notifications)
- date-fns (date utilities)

## Project Structure

```
├── app/
│   ├── (app)/                    # Protected routes
│   │   ├── layout.tsx           # Protected layout with auth check
│   │   ├── dashboard/
│   │   ├── journal/
│   │   ├── advice/
│   │   ├── assessment/
│   │   ├── mood-trends/
│   │   └── emergency/
│   ├── login/                    # Public login page
│   ├── register/                 # Public register page
│   └── layout.tsx               # Root layout with providers
├── contexts/
│   ├── auth-context.tsx         # Authentication state & methods
│   └── baby-context.tsx         # Baby profile state & methods
├── components/
│   ├── providers.tsx            # Context providers wrapper
│   ├── protected-route.tsx      # Route protection HOC
│   ├── error-boundary.tsx       # Error handling component
│   └── loading-skeleton.tsx     # Loading states
├── lib/
│   ├── api.ts                   # Axios instance with interceptors
│   ├── api-services.ts          # API service functions
│   ├── types.ts                 # TypeScript types
│   ├── constants.ts             # App constants & config
│   ├── storage.ts               # localStorage helpers
│   ├── date-utils.ts            # Date formatting utilities
│   └── utils.ts                 # General utilities
└── hooks/
    └── use-api.ts               # Custom API hook
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Run Development Server
```bash
npm run dev
```

## Key Features

### Authentication System
- JWT token-based authentication
- Auto-redirect on 401 errors
- Persistent login with localStorage
- Protected routes with `ProtectedRoute` component

### State Management
- `AuthContext`: User authentication state
- `BabyContext`: Baby profile management
- Automatic token injection in API requests

### API Integration
- Axios instance with interceptors
- Automatic auth token in headers
- Global error handling
- 401 redirect to login
- Toast notifications for errors

### Form Validation
- React Hook Form for form state
- Zod schemas for validation
- Type-safe form data

### Loading States
- Skeleton loaders for better UX
- Loading spinners in buttons
- Global loading states in contexts

## Usage Examples

### Using Auth Context
```tsx
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Login
  await login({ email, password });
  
  // Logout
  logout();
}
```

### Using Baby Context
```tsx
import { useBaby } from '@/contexts/baby-context';

function MyComponent() {
  const { babies, selectedBaby, selectBaby, fetchBabies } = useBaby();
  
  useEffect(() => {
    fetchBabies();
  }, []);
}
```

### Making API Calls
```tsx
import { journalService } from '@/lib/api-services';
import { useApi } from '@/hooks/use-api';

function MyComponent() {
  const { execute, isLoading, data } = useApi(
    journalService.getAll,
    { showSuccessToast: true }
  );
  
  useEffect(() => {
    execute(babyId);
  }, [babyId]);
}
```

### Protected Routes
All routes under `app/(app)/` are automatically protected. Users must be authenticated to access them.

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/emergency` - Emergency resources (public access)

## API Endpoints Expected

The app expects the following API endpoints:

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /auth/me` - Get current user

### Babies
- `GET /babies` - Get all babies
- `POST /babies` - Create baby profile
- `PUT /babies/:id` - Update baby profile
- `DELETE /babies/:id` - Delete baby profile

### Journals
- `GET /journals?babyId=:id` - Get journals
- `POST /journals` - Create journal entry
- `PUT /journals/:id` - Update journal entry
- `DELETE /journals/:id` - Delete journal entry

### Mental Health
- `GET /mental-health/score?babyId=:id` - Get current score
- `GET /mental-health/history?babyId=:id&days=30` - Get history
- `POST /mental-health/assessment` - Submit assessment

### Advice
- `GET /advice?category=:category` - Get advice
- `GET /advice/search?q=:query` - Search advice

### Trends
- `GET /trends/mood?babyId=:id&days=30` - Get mood trends
- `GET /trends/sentiment?babyId=:id&days=30` - Get sentiment trends

## Error Handling

### Global Error Handling
- API errors show toast notifications
- 401 errors auto-redirect to login
- Network errors show user-friendly messages

### Error Boundary
Wraps the entire app to catch React errors and show fallback UI.

## Utilities

### Date Formatting
```tsx
import { formatDate, formatRelativeTime, calculateAge } from '@/lib/date-utils';

formatDate('2024-01-01'); // "Jan 01, 2024"
formatRelativeTime('2024-01-01'); // "2 months ago"
calculateAge('2023-06-15'); // "8 months"
```

### Sentiment Colors
```tsx
import { getSentimentColor, MOOD_COLORS } from '@/lib/constants';

const color = getSentimentColor(0.8); // Returns green
const moodColor = MOOD_COLORS.happy; // "#10b981"
```

## Next Steps

1. Install dependencies: `npm install`
2. Set up environment variables
3. Connect to your backend API
4. Customize the UI components as needed
5. Add additional features or pages

## Notes

- All API calls automatically include the auth token
- localStorage is used for persistence (token, user, selected baby)
- The app uses Next.js App Router with client-side navigation
- TypeScript provides full type safety across the app

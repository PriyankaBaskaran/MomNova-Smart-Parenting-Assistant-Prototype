# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              React App (Next.js)                    │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │         App Router (Next.js)             │     │    │
│  │  │                                          │     │    │
│  │  │  Public Routes:                          │     │    │
│  │  │  - / (landing)                           │     │    │
│  │  │  - /login                                │     │    │
│  │  │  - /register                             │     │    │
│  │  │                                          │     │    │
│  │  │  Protected Routes (app/(app)/):          │     │    │
│  │  │  - /dashboard                            │     │    │
│  │  │  - /journal                              │     │    │
│  │  │  - /advice                               │     │    │
│  │  │  - /assessment                           │     │    │
│  │  │  - /mood-trends                          │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │         Context Providers                 │     │    │
│  │  │                                          │     │    │
│  │  │  ┌────────────┐    ┌────────────┐       │     │    │
│  │  │  │ AuthContext│    │BabyContext │       │     │    │
│  │  │  │            │    │            │       │     │    │
│  │  │  │ - user     │    │ - babies   │       │     │    │
│  │  │  │ - token    │    │ - selected │       │     │    │
│  │  │  │ - login()  │    │ - select() │       │     │    │
│  │  │  │ - logout() │    │ - fetch()  │       │     │    │
│  │  │  └────────────┘    └────────────┘       │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │         API Layer                         │     │    │
│  │  │                                          │     │    │
│  │  │  ┌────────────────────────────────┐     │     │    │
│  │  │  │   Axios Instance (api.ts)      │     │     │    │
│  │  │  │                                │     │     │    │
│  │  │  │  Request Interceptor:          │     │     │    │
│  │  │  │  - Add auth token              │     │     │    │
│  │  │  │                                │     │     │    │
│  │  │  │  Response Interceptor:         │     │     │    │
│  │  │  │  - Handle 401 → redirect       │     │     │    │
│  │  │  │  - Handle errors               │     │     │    │
│  │  │  └────────────────────────────────┘     │     │    │
│  │  │                                          │     │    │
│  │  │  ┌────────────────────────────────┐     │     │    │
│  │  │  │   API Services                 │     │     │    │
│  │  │  │                                │     │     │    │
│  │  │  │  - journalService              │     │     │    │
│  │  │  │  - mentalHealthService         │     │     │    │
│  │  │  │  - adviceService               │     │     │    │
│  │  │  │  - trendsService               │     │     │    │
│  │  │  └────────────────────────────────┘     │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │         Storage Layer                     │     │    │
│  │  │                                          │     │    │
│  │  │  localStorage:                           │     │    │
│  │  │  - auth_token                            │     │    │
│  │  │  - user_data                             │     │    │
│  │  │  - selected_baby                         │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ Authorization: Bearer <token>
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│                                                              │
│  Endpoints:                                                  │
│  - POST /api/auth/login                                      │
│  - POST /api/auth/register                                   │
│  - GET  /api/auth/me                                         │
│  - GET  /api/babies                                          │
│  - POST /api/babies                                          │
│  - GET  /api/journals                                        │
│  - POST /api/journals                                        │
│  - GET  /api/mental-health/score                             │
│  - GET  /api/advice                                          │
│  - GET  /api/trends/mood                                     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
1. User enters credentials
   ↓
2. Login form validates with Zod
   ↓
3. AuthContext.login() called
   ↓
4. API call to /auth/login
   ↓
5. Token received and stored
   ↓
6. User data stored in context & localStorage
   ↓
7. Redirect to /dashboard
```

### Protected Route Access
```
1. User navigates to /dashboard
   ↓
2. ProtectedRoute checks isAuthenticated
   ↓
3. If not authenticated → redirect to /login
   ↓
4. If authenticated → render page
   ↓
5. Page makes API calls with auto-injected token
```

### API Request Flow
```
1. Component calls API service
   ↓
2. Axios request interceptor adds token
   ↓
3. Request sent to backend
   ↓
4. Response received
   ↓
5. Response interceptor checks status
   ↓
6. If 401 → clear storage, redirect to login
   ↓
7. If success → return data
   ↓
8. Component updates state
```

## Component Hierarchy

```
app/layout.tsx (Root)
├── Providers
│   ├── ThemeProvider
│   ├── AuthProvider
│   │   └── AuthContext
│   └── BabyProvider
│       └── BabyContext
│
├── Public Routes
│   ├── / (Landing)
│   ├── /login
│   └── /register
│
└── Protected Routes (app/(app)/)
    ├── ProtectedRoute (HOC)
    │   └── Checks authentication
    │
    └── App Layout
        ├── AppHeader
        ├── AppSidebar
        ├── Main Content
        │   ├── /dashboard
        │   ├── /journal
        │   ├── /advice
        │   ├── /assessment
        │   └── /mood-trends
        └── AppFooter
```

## State Management

### AuthContext State
```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  login: (credentials) => Promise<void>,
  register: (data) => Promise<void>,
  logout: () => void,
  refreshUser: () => Promise<void>
}
```

### BabyContext State
```typescript
{
  babies: Baby[],
  selectedBaby: Baby | null,
  isLoading: boolean,
  selectBaby: (baby) => void,
  fetchBabies: () => Promise<void>,
  addBaby: (baby) => Promise<void>,
  updateBaby: (id, baby) => Promise<void>,
  deleteBaby: (id) => Promise<void>
}
```

## Error Handling Strategy

```
┌─────────────────────────────────────────┐
│         Error Boundary (Top Level)      │
│         Catches React errors            │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      API Response Interceptor           │
│      - 401 → Auto redirect to login     │
│      - Network errors → User message    │
│      - Other errors → Toast notification│
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Component Level                    │
│      - try/catch blocks                 │
│      - Loading states                   │
│      - Error messages                   │
└─────────────────────────────────────────┘
```

## Security Features

1. **JWT Token Storage**: Stored in localStorage, auto-injected in requests
2. **Protected Routes**: ProtectedRoute HOC checks authentication
3. **Auto Logout**: 401 responses trigger automatic logout
4. **Token Expiration**: Backend should handle token validation
5. **HTTPS**: Use HTTPS in production for secure transmission

## Performance Optimizations

1. **Parallel API Calls**: Use Promise.all() for independent requests
2. **Loading States**: Show skeletons while data loads
3. **Context Optimization**: Separate contexts to prevent unnecessary re-renders
4. **Lazy Loading**: Next.js automatically code-splits routes
5. **Caching**: Consider adding React Query for advanced caching

## Type Safety

All API responses and requests are fully typed:
- Request payloads
- Response data
- Context state
- Component props
- Form data

This ensures compile-time safety and better developer experience.

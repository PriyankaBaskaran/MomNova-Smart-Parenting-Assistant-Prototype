# Quick Start Guide

## Installation

```bash
# Install axios
npm install axios
# or
pnpm add axios
```

## Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Basic Usage

### 1. Authentication

```tsx
import { useAuth } from '@/contexts/auth-context';

function LoginComponent() {
  const { login, logout, user, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password' });
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 2. Baby Profile Management

```tsx
import { useBaby } from '@/contexts/baby-context';

function BabySelector() {
  const { babies, selectedBaby, selectBaby, fetchBabies } = useBaby();

  useEffect(() => {
    fetchBabies();
  }, []);

  return (
    <select onChange={(e) => selectBaby(babies[e.target.value])}>
      {babies.map((baby, index) => (
        <option key={baby.id} value={index}>
          {baby.name}
        </option>
      ))}
    </select>
  );
}
```

### 3. API Calls with Loading States

```tsx
import { useState, useEffect } from 'react';
import { journalService } from '@/lib/api-services';
import { useBaby } from '@/contexts/baby-context';

function JournalList() {
  const { selectedBaby } = useBaby();
  const [journals, setJournals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedBaby) return;

    const fetchJournals = async () => {
      try {
        setIsLoading(true);
        const data = await journalService.getAll(selectedBaby.id);
        setJournals(data);
      } catch (error) {
        console.error('Failed to fetch journals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournals();
  }, [selectedBaby]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {journals.map(journal => (
        <div key={journal.id}>{journal.content}</div>
      ))}
    </div>
  );
}
```

### 4. Form Handling with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { journalService } from '@/lib/api-services';
import { toast } from 'sonner';

const schema = z.object({
  content: z.string().min(10),
  mood: z.enum(['happy', 'neutral', 'sad', 'anxious', 'stressed']),
});

function JournalForm({ babyId }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await journalService.create({ ...data, babyId, date: new Date().toISOString() });
      toast.success('Journal saved!');
    } catch (error) {
      toast.error('Failed to save journal');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register('content')} />
      {errors.content && <span>{errors.content.message}</span>}
      
      <select {...register('mood')}>
        <option value="happy">Happy</option>
        <option value="neutral">Neutral</option>
        <option value="sad">Sad</option>
      </select>
      
      <button type="submit">Save</button>
    </form>
  );
}
```

## Testing API

Open browser console and run:

```javascript
// Import the test utilities
import { testAPI } from '@/lib/api-test';

// Test all endpoints
testAPI.testAll();

// Or test specific endpoints
testAPI.testAuth();
testAPI.testBabies();
```

## Common Patterns

### Protected Page
```tsx
// Pages under app/(app)/ are automatically protected
// No additional code needed!
```

### Loading Skeleton
```tsx
import { DashboardSkeleton } from '@/components/loading-skeleton';

function MyPage() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) return <DashboardSkeleton />;
  
  return <div>Content</div>;
}
```

### Error Handling
```tsx
import { handleApiError } from '@/lib/api';
import { toast } from 'sonner';

try {
  await someApiCall();
} catch (error) {
  const message = handleApiError(error);
  toast.error(message);
}
```

### Date Formatting
```tsx
import { formatDate, formatRelativeTime, calculateAge } from '@/lib/date-utils';

formatDate('2024-01-01'); // "Jan 01, 2024"
formatRelativeTime('2024-01-01'); // "2 months ago"
calculateAge('2023-06-15'); // "8 months"
```

## File Structure Reference

```
Key Files:
├── contexts/
│   ├── auth-context.tsx          ← Authentication state
│   └── baby-context.tsx          ← Baby profile state
├── lib/
│   ├── api.ts                    ← Axios instance
│   ├── api-services.ts           ← API functions
│   ├── types.ts                  ← TypeScript types
│   ├── constants.ts              ← Config & constants
│   ├── storage.ts                ← localStorage helpers
│   └── date-utils.ts             ← Date formatting
├── components/
│   ├── providers.tsx             ← Context wrapper
│   ├── protected-route.tsx       ← Route protection
│   └── loading-skeleton.tsx      ← Loading states
└── app/
    ├── login/page.tsx            ← Login page
    ├── register/page.tsx         ← Register page
    └── (app)/                    ← Protected routes
        ├── dashboard/
        ├── journal/
        └── ...
```

## Next Steps

1. ✅ Install axios: `npm install axios`
2. ✅ Set up `.env.local` with API URL
3. ✅ Start dev server: `npm run dev`
4. 📝 Connect your backend API
5. 🎨 Customize UI components
6. 🚀 Build your features!

## Need Help?

- Check `INTEGRATION_GUIDE.md` for detailed documentation
- See example files: `*-with-api.tsx.example`
- Review API services in `lib/api-services.ts`

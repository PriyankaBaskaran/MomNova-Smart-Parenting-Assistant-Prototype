# Dashboard Troubleshooting Guide

## Issue Fixed ✅

**Problem:** Missing newline before `return` statement causing syntax issues

**Solution:** Added proper spacing in the dashboard component

## Common Dashboard Issues & Solutions

### 1. Dashboard Shows Loading Forever

**Symptoms:**
- Dashboard stuck on loading skeleton
- No data appears

**Causes & Solutions:**

#### A. No Baby Profile
```
Solution: Create a baby profile
1. You should see "Create Baby Profile" prompt
2. If not, check browser console for errors
3. Verify baby context is working
```

#### B. API Errors
```
Solution: Check API connection
1. Open browser DevTools → Network tab
2. Look for failed API calls (red)
3. Check the error response
4. Verify .env.local has correct API URL
```

#### C. Authentication Issues
```
Solution: Re-login
1. Logout from the app
2. Clear localStorage (DevTools → Application → Local Storage)
3. Login again
4. Baby profiles should auto-load
```

### 2. "Cannot read property 'name' of undefined"

**Symptoms:**
- Error in console about undefined user or baby
- Dashboard crashes

**Solution:**
```typescript
// The code already handles this with optional chaining:
user?.name || 'there'
selectedBaby?.name || 'your baby'

// If you still see this error, check:
1. AuthContext is properly wrapped in layout
2. BabyContext is properly wrapped in layout
3. Both contexts are in Providers component
```

### 3. No Journal Entries Showing

**Symptoms:**
- Recent Journals section is empty
- But you have created journals

**Causes:**
- Journals created for different baby
- Date range issue
- API not returning data

**Solution:**
```bash
1. Check which baby is selected (header dropdown)
2. Create a new journal entry for current baby
3. Refresh dashboard
4. Check Network tab for API response
```

### 4. Mental Health Score Shows 0

**Symptoms:**
- Score always shows 0
- "Not assessed" message

**Causes:**
- No journal entries yet
- Assessment API not returning data
- Need more journal entries for assessment

**Solution:**
```bash
1. Create at least 3-5 journal entries
2. Wait a few minutes
3. Refresh dashboard
4. Score should update based on journal sentiment
```

### 5. Mood Trends Chart Not Showing Data

**Symptoms:**
- Chart shows flat line
- No trend data

**Causes:**
- No journal entries in last 7 days
- Analytics API not returning data

**Solution:**
```bash
1. Create journal entries
2. Wait for sentiment analysis
3. Refresh dashboard
4. Chart should show trend based on journal sentiment
```

## Debugging Steps

### Step 1: Check Browser Console
```bash
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Common errors:
   - "Failed to fetch" → API connection issue
   - "401 Unauthorized" → Token expired, re-login
   - "Cannot read property" → Context issue
```

### Step 2: Check Network Tab
```bash
1. Open DevTools → Network tab
2. Refresh dashboard
3. Look for API calls:
   - GET /Baby → Should return your babies
   - GET /Journal/entries → Should return journals
   - GET /MentalHealth/assessment → Should return score
   - GET /Analytics/mood-trends → Should return trends
4. Click on failed requests to see error details
```

### Step 3: Check Local Storage
```bash
1. Open DevTools → Application tab
2. Go to Local Storage
3. Check for:
   - auth_token → Should have JWT token
   - user_data → Should have user info
   - selected_baby → Should have baby info
4. If missing, re-login
```

### Step 4: Verify API URL
```bash
1. Check .env.local file exists
2. Verify it contains:
   NEXT_PUBLIC_API_URL=https://y3vmpncgmc.ap-south-1.awsapprunner.com/api/v1
3. Restart dev server after changing .env
```

## Testing Dashboard Data Flow

### Test 1: User Data
```bash
1. Login
2. Check header shows your name (not "Priya")
3. If shows "Priya" → Clear cache and re-login
```

### Test 2: Baby Data
```bash
1. After login, check header for baby selector
2. Should show your baby's name
3. If empty → Create baby profile
4. If shows mock data → Check API response
```

### Test 3: Journal Data
```bash
1. Go to /journal
2. Create a journal entry
3. Go back to /dashboard
4. Should see entry in "Recent Journals"
5. If not → Check Network tab for API errors
```

### Test 4: Mental Health Score
```bash
1. Create 5+ journal entries with different moods
2. Wait 1 minute
3. Refresh dashboard
4. Score should update
5. If still 0 → Check API response for assessment
```

## Quick Fixes

### Fix 1: Clear Everything and Start Fresh
```bash
1. Logout
2. Open DevTools → Application → Local Storage
3. Click "Clear All"
4. Close browser
5. Open browser
6. Go to /register
7. Create new account
8. Create baby profile
9. Create journal entries
10. Check dashboard
```

### Fix 2: Force Refresh Data
```bash
1. Open browser console
2. Run: localStorage.clear()
3. Refresh page
4. Login again
```

### Fix 3: Check API Health
```bash
# Test API directly
curl https://y3vmpncgmc.ap-south-1.awsapprunner.com/swagger/index.html

# Should return Swagger UI HTML
# If fails → API is down
```

## Expected Behavior

### On First Login (No Baby)
```
1. Dashboard shows "Create Baby Profile" prompt
2. Click button → Form opens
3. Fill form → Baby created
4. Dashboard loads with empty data (no journals yet)
```

### After Creating Baby
```
1. Header shows baby name in dropdown
2. Dashboard shows:
   - Mental Health Score: 0 (no data yet)
   - Quick Actions: Available
   - Mood Trends: Flat line (no data yet)
   - Recent Journals: Empty
```

### After Creating Journals
```
1. Dashboard shows:
   - Mental Health Score: Calculated from journals
   - Mood Trends: Shows sentiment over time
   - Recent Journals: Shows last 3 entries
2. All data updates in real-time
```

## Still Having Issues?

### Check These Files
1. `app/(app)/dashboard/page.tsx` - Dashboard component
2. `contexts/auth-context.tsx` - User authentication
3. `contexts/baby-context.tsx` - Baby data
4. `lib/api-services.ts` - API calls
5. `components/layout/app-header.tsx` - Header with user/baby

### Verify Integration
```bash
# All these should return real data:
- user?.name → Your actual name
- user?.email → Your actual email
- selectedBaby?.name → Your baby's name
- journals.length → Number of your journals
- assessment?.riskScore → Your mental health score
```

## Contact Points

If dashboard still has issues:
1. Check browser console for specific errors
2. Check Network tab for failed API calls
3. Verify .env.local configuration
4. Try clearing cache and re-login
5. Check API is accessible

Dashboard should now work with 100% real data! 🎉

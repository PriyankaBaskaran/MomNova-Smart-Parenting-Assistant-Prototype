# Smart Parenting Assistant - API Integration Guide

## API Base URL
```
Production: https://y3vmpncgmc.ap-south-1.awsapprunner.com/api/v1
Local Dev: http://localhost:5000/api/v1
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Register
```typescript
POST /Auth/register
Body: {
  email: string
  password: string
  name: string
  location?: string
}
Response: {
  token: string
  userId: string
  email: string
  name: string
}
```

### Login
```typescript
POST /Auth/login
Body: {
  email: string
  password: string
}
Response: {
  token: string
  userId: string
  email: string
  name: string
}
```

## Baby Profile

### Create Baby Profile
```typescript
POST /Baby
Body: {
  userId?: string  // Auto-filled from JWT
  name: string
  dateOfBirth: string  // ISO 8601 format
  gender?: string
  feedingType?: string
  notes?: string
}
Response: Baby object
```

### Get Baby Profile
```typescript
GET /Baby/{babyId}
Response: Baby object
```

## Journal Entries

### Create Journal Entry
```typescript
POST /Journal/entries
Body: {
  content: string  // Max 5000 characters
  mood?: string    // e.g., "happy", "anxious", "tired"
  babyId: string
}
Response: {
  id: string
  content: string
  mood: string
  sentiment: string  // "POSITIVE", "NEGATIVE", "NEUTRAL", "MIXED"
  sentimentScores: {
    positive: number
    negative: number
    neutral: number
    mixed: number
  }
  confidenceScore: number
  language: string
  createdAt: string
  hasRedFlags: boolean
  emergencyResources?: Array<{
    name: string
    phone: string
    description: string
  }>
}
```

### Get Journal Entries
```typescript
GET /Journal/entries?startDate={ISO8601}&endDate={ISO8601}
Response: JournalEntry[]
```

### Get Single Journal Entry
```typescript
GET /Journal/entries/{id}
Response: JournalEntry
```

### Update Journal Entry
```typescript
PUT /Journal/entries/{id}
Body: Partial<CreateJournalEntryRequest>
Response: JournalEntry
```

### Delete Journal Entry
```typescript
DELETE /Journal/entries/{id}
Response: 204 No Content
```

## Mental Health Assessment

### Get Assessment
```typescript
GET /MentalHealth/assessment?days={number}
// days: Number of days to analyze (default: 14)
Response: {
  riskLevel: string
  riskScore: number  // 0-100
  recommendations: string[]
  concerningPatterns: string[]
  positiveIndicators: string[]
  assessmentDate: string
}
```

## Daily Advice

### Generate Daily Advice
```typescript
POST /DailyAdvice/generate?babyId={babyId}
Response: {
  advice: string
  category: string
  babyAgeInDays: number
  generatedAt: string
}
```

## Analytics

### Get Mood Trends
```typescript
GET /Analytics/mood-trends?startDate={ISO8601}&endDate={ISO8601}
Response: {
  startDate: string
  endDate: string
  averageSentiment: number
  trend: string  // "improving", "declining", "stable"
  hasConcerningPattern: boolean  // 3+ consecutive negative days
}
```

## Sentiment Analysis

### Analyze Text
```typescript
POST /SentimentAnalysis/analyze
Body: {
  babyId?: string
  text: string
}
Response: {
  sentiment: string
  sentimentScores: SentimentScores
  confidenceScore: number
  language: string
  hasRedFlags: boolean
  emergencyResources?: EmergencyResource[]
}
```

### Get Sentiment History
```typescript
GET /SentimentAnalysis/{babyId}
Response: SentimentAnalysisResult[]
```

## Usage Examples

### Complete Login Flow
```typescript
import { useAuth } from '@/contexts/auth-context';

function LoginComponent() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
      // Automatically redirects to dashboard
      // Token stored in localStorage
      // User data available in context
    } catch (error) {
      // Error toast shown automatically
    }
  };
}
```

### Create Journal Entry with Sentiment Analysis
```typescript
import { journalService } from '@/lib/api-services';
import { useBaby } from '@/contexts/baby-context';

function JournalForm() {
  const { selectedBaby } = useBaby();

  const handleSubmit = async (content: string, mood: string) => {
    const entry = await journalService.create({
      content,
      mood,
      babyId: selectedBaby.id
    });

    // Entry includes automatic sentiment analysis
    console.log('Sentiment:', entry.sentiment);
    console.log('Scores:', entry.sentimentScores);
    
    // Check for red flags
    if (entry.hasRedFlags) {
      // Show emergency resources
      console.log('Resources:', entry.emergencyResources);
    }
  };
}
```

### Get Mental Health Assessment
```typescript
import { mentalHealthService } from '@/lib/api-services';

async function loadAssessment() {
  const assessment = await mentalHealthService.getAssessment(14);
  
  console.log('Risk Level:', assessment.riskLevel);
  console.log('Risk Score:', assessment.riskScore);
  console.log('Recommendations:', assessment.recommendations);
  
  if (assessment.concerningPatterns.length > 0) {
    // Show concerning patterns
  }
}
```

### Analyze Mood Trends
```typescript
import { analyticsService } from '@/lib/api-services';

async function loadTrends() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const trends = await analyticsService.getMoodTrends(
    startDate.toISOString(),
    endDate.toISOString()
  );

  console.log('Average Sentiment:', trends.averageSentiment);
  console.log('Trend:', trends.trend);
  
  if (trends.hasConcerningPattern) {
    // Alert user about concerning pattern
  }
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

All errors are automatically handled by the axios interceptor:
- 401 errors trigger automatic logout and redirect to login
- Other errors show toast notifications
- Network errors show user-friendly messages

## Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://y3vmpncgmc.ap-south-1.awsapprunner.com/api/v1
```

For local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Key Features

### Automatic Sentiment Analysis
Every journal entry is automatically analyzed for:
- Overall sentiment (POSITIVE, NEGATIVE, NEUTRAL, MIXED)
- Detailed sentiment scores (positive, negative, neutral, mixed percentages)
- Confidence score
- Language detection
- Red flag detection for concerning content

### Emergency Resources
When red flags are detected, the API automatically provides:
- Crisis helpline numbers
- Mental health resources
- Support services

### Mental Health Tracking
The assessment endpoint analyzes journal entries over time to:
- Calculate risk scores
- Identify concerning patterns
- Provide personalized recommendations
- Track positive indicators

### Mood Trends
Analytics endpoint provides:
- Average sentiment over time
- Trend direction (improving/declining/stable)
- Pattern detection (3+ consecutive negative days)

## Testing

Use the provided test utilities:
```typescript
import { testAPI } from '@/lib/api-test';

// Test all endpoints
testAPI.testAll();

// Test specific endpoints
testAPI.testAuth();
testAPI.testJournals('baby-id');
```

## Notes

- All dates should be in ISO 8601 format
- JWT tokens are automatically included in requests
- Responses are automatically unwrapped by the API client
- The API uses AWS services (DynamoDB, Comprehend, Bedrock)
- CORS is enabled for all origins (configure for production)

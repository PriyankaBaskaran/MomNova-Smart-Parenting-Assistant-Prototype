# React Frontend Integration Guide

## API Configuration

Once your API is deployed to AWS App Runner, you'll get a URL like:
```
https://xxxxx.ap-south-1.awsapprunner.com
```

## React Setup

### 1. Environment Variables (.env)

```env
REACT_APP_API_BASE_URL=https://your-service.ap-south-1.awsapprunner.com
REACT_APP_API_VERSION=v1
```

### 2. API Client Setup (src/services/api.js)

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 3. Authentication Service (src/services/auth.js)

```javascript
import api from './api';

export const authService = {
  async register(email, password, name) {
    const response = await api.post('/Auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/Auth/login', {
      email,
      password,
    });
    const { token, userId } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
```

### 4. Baby Profile Service (src/services/baby.js)

```javascript
import api from './api';

export const babyService = {
  async createProfile(babyData) {
    const response = await api.post('/Baby', {
      name: babyData.name,
      dateOfBirth: babyData.dateOfBirth,
      gender: babyData.gender,
      feedingType: babyData.feedingType,
    });
    return response.data;
  },

  async getProfile(babyId) {
    const response = await api.get(`/Baby/${babyId}`);
    return response.data;
  },
};
```

### 5. Journal Service (src/services/journal.js)

```javascript
import api from './api';

export const journalService = {
  async createEntry(content, babyId) {
    const response = await api.post('/Journal/entries', {
      content,
      babyId,
    });
    return response.data;
  },

  async getEntries(startDate, endDate) {
    const response = await api.get('/Journal/entries', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
```

### 6. Daily Advice Service (src/services/advice.js)

```javascript
import api from './api';

export const adviceService = {
  async getDailyAdvice(babyId) {
    const response = await api.post(`/DailyAdvice/generate?babyId=${babyId}`);
    return response.data;
  },
};
```

### 7. Mental Health Service (src/services/mentalHealth.js)

```javascript
import api from './api';

export const mentalHealthService = {
  async getAssessment(days = 14) {
    const response = await api.get(`/MentalHealth/assessment?days=${days}`);
    return response.data;
  },
};
```

## Example React Component

```javascript
import React, { useState, useEffect } from 'react';
import { adviceService } from '../services/advice';
import { mentalHealthService } from '../services/mentalHealth';

function Dashboard({ babyId }) {
  const [advice, setAdvice] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [babyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [adviceData, assessmentData] = await Promise.all([
        adviceService.getDailyAdvice(babyId),
        mentalHealthService.getAssessment(14),
      ]);
      setAdvice(adviceData);
      setAssessment(assessmentData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Daily Advice</h2>
      <p>{advice?.advice}</p>

      <h2>Mental Health Assessment</h2>
      <div>
        <p>Risk Level: {assessment?.riskLevel}</p>
        <p>Risk Score: {assessment?.riskScore}/100</p>
        <ul>
          {assessment?.recommendations?.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
```

## Deploy React Frontend

### Option 1: AWS Amplify (Recommended)
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

**Cost:** Free tier (1000 build minutes/month)

### Option 2: AWS S3 + CloudFront
```bash
# Build
npm run build

# Deploy to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Create CloudFront distribution (in console)
```

**Cost:** ~$1-2/month

### Option 3: Vercel (Easiest)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Cost:** Free for personal projects

## CORS Configuration

Your API already has CORS enabled for all origins. In production, update to specific origin:

```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://your-react-app.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## Complete Architecture

```
React Frontend (Amplify/Vercel)
    ↓ HTTPS
API (AWS App Runner)
    ↓
AWS Services:
- Cognito (Auth)
- DynamoDB (Data)
- Comprehend (Sentiment)
- Bedrock (AI)
```

## Testing Locally

```bash
# Start React dev server
npm start

# Update .env.local
REACT_APP_API_BASE_URL=http://localhost:5000
```

Your API is ready for React integration!

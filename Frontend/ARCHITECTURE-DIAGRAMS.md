# Architecture Diagrams for Smart Parenting Assistant

## 🎨 Diagram 1: High-Level AWS Architecture

### Purpose: Show all AWS services and how they connect

### Components to Draw:

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
│  👤 Mother (Mobile/Desktop Browser)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         AWS Amplify Hosting                               │  │
│  │  • React Application (TypeScript)                         │  │
│  │  • CloudFront CDN                                         │  │
│  │  • S3 Static Hosting                                      │  │
│  │  • Auto SSL/TLS                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API (HTTPS)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         AWS App Runner                                    │  │
│  │  • .NET 8 Web API (Containerized)                        │  │
│  │  • Auto-scaling (1-10 instances)                         │  │
│  │  • Load Balancing                                        │  │
│  │  • Health Monitoring                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└───┬────────┬────────┬────────┬────────┬────────┬───────────────┘
    │        │        │        │        │        │
    ▼        ▼        ▼        ▼        ▼        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AWS SERVICES LAYER                            │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Amazon   │  │ Amazon   │  │ Amazon   │  │ Amazon   │       │
│  │ Cognito  │  │ Bedrock  │  │Comprehend│  │Transcribe│       │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤       │
│  │• User    │  │• Meta    │  │• Sentiment│  │• Voice   │       │
│  │  Auth    │  │  Llama 3 │  │  Analysis│  │  to Text │       │
│  │• JWT     │  │• Daily   │  │• Hindi/  │  │• Hindi/  │       │
│  │  Tokens  │  │  Advice  │  │  English │  │  English │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Amazon DynamoDB (NoSQL Database)                  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │  Users   │ │ Journals │ │  Babies  │ │  Mood    │   │  │
│  │  │  Table   │ │  Table   │ │  Table   │ │ Analysis │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Color Coding:
- **User Layer:** Light Blue (#E3F2FD)
- **Frontend (Amplify):** Green (#C8E6C9)
- **Backend (App Runner):** Orange (#FFE0B2)
- **AWS Services:** Purple (#E1BEE7)
- **Database:** Yellow (#FFF9C4)

### Labels to Add:
- "6 AWS Services"
- "Region: ap-south-1 (Mumbai)"
- "Auto-scaling & Serverless"


---

## 🔄 Diagram 2: Journal Entry Process Flow

### Purpose: Show complete user journey from journal entry to sentiment analysis

### Step-by-Step Flow:

```
START: Mother wants to journal
         │
         ▼
    ┌─────────┐
    │ Option? │
    └────┬────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌────────┐
│ Type   │  │ Voice  │
│ Text   │  │ Input  │
└───┬────┘  └───┬────┘
    │           │
    │           ▼
    │      ┌──────────────┐
    │      │   Amazon     │
    │      │  Transcribe  │
    │      │ (Voice→Text) │
    │      └──────┬───────┘
    │             │
    └─────────────┴─────────────┐
                                │
                                ▼
                    ┌───────────────────┐
                    │  Frontend (React) │
                    │  Validates Input  │
                    └─────────┬─────────┘
                              │
                              ▼ POST /api/v1/journal/entries
                    ┌───────────────────┐
                    │   App Runner API  │
                    │  (.NET 8 Backend) │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Save to DynamoDB │
                    │  (Journal Table)  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │     Amazon        │
                    │   Comprehend      │
                    │ Analyze Sentiment │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Calculate Score  │
                    │  Positive: 0.05   │
                    │  Negative: 0.85   │
                    │  Neutral: 0.08    │
                    │  Mixed: 0.02      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Red Flag Check   │
                    │  Keywords:        │
                    │  hopeless, harm,  │
                    │  worthless, etc.  │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ No Red Flags │    │ Red Flags!   │
            │ Return Result│    │ Add Crisis   │
            │              │    │ Resources    │
            └──────┬───────┘    └──────┬───────┘
                   │                   │
                   └─────────┬─────────┘
                             │
                             ▼
                   ┌───────────────────┐
                   │  Update DynamoDB  │
                   │  with Sentiment   │
                   └─────────┬─────────┘
                             │
                             ▼
                   ┌───────────────────┐
                   │  Return to User   │
                   │  • Entry saved    │
                   │  • Sentiment shown│
                   │  • Alerts (if any)│
                   └───────────────────┘
                             │
                             ▼
                          END

Time: ~2-3 seconds total
```

### Annotations:
- Add timing at each step (e.g., "Transcribe: 1-2s", "Comprehend: 500ms")
- Highlight AWS services in purple boxes
- Show data format at key points


---

## 🧠 Diagram 3: Mental Health Risk Assessment Flow

### Purpose: Show AI-powered risk detection process

```
TRIGGER: User requests mental health assessment
         │
         ▼
┌────────────────────────┐
│   Frontend Request     │
│ GET /mental-health/    │
│     assessment?days=14 │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   App Runner API       │
│  MentalHealthController│
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Query DynamoDB       │
│ Get last 14 days of    │
│ journal entries        │
│ (with sentiments)      │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│   AI Risk Analysis Engine              │
│                                        │
│  1. Analyze Sentiment Patterns        │
│     • Count negative days (5/7)       │
│     • Check consecutive negatives (3+)│
│     • Calculate average sentiment     │
│                                        │
│  2. Detect Red Flag Keywords          │
│     • "hopeless" → +15 points         │
│     • "can't cope" → +10 points       │
│     • "worthless" → +15 points        │
│                                        │
│  3. Identify Risk Factors             │
│     • Sleep deprivation patterns      │
│     • Social isolation indicators     │
│     • Family stress mentions          │
│     • Anxiety/panic keywords          │
│                                        │
│  4. Find Protective Factors           │
│     • Active journaling               │
│     • Seeking support                 │
│     • Positive coping strategies      │
│                                        │
│  5. Calculate Risk Score (0-100)      │
│     Base: 20                          │
│     + Negative days: +25              │
│     + Red flags: +15                  │
│     + Sleep issues: +10               │
│     - Protective factors: -5          │
│     = Total: 65/100                   │
└───────────┬────────────────────────────┘
            │
            ▼
┌────────────────────────┐
│  Determine Risk Level  │
│  0-30: Low             │
│  31-50: Moderate       │
│  51-75: High ← Current │
│  76-100: Critical      │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  Generate              │
│  Recommendations       │
│  • Talk to doctor      │
│  • Join support group  │
│  • Daily self-care     │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Amazon Bedrock       │
│  Generate personalized │
│  intervention advice   │
│  (if model available)  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  Save Assessment       │
│  to DynamoDB           │
│  (MoodAnalysis Table)  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  Return to User        │
│  • Risk Score: 65/100  │
│  • Risk Level: High    │
│  • Risk Factors (list) │
│  • Protective Factors  │
│  • Recommendations     │
│  • Intervention Advice │
└────────────────────────┘
            │
            ▼
         END

Processing Time: ~1-2 seconds
```

### Key Metrics to Highlight:
- "Analyzes 14 days of data in <1 second"
- "Detects patterns humans miss"
- "Provides actionable recommendations"


---

## 💬 Diagram 4: Daily Advice Generation Flow

### Purpose: Show how AI generates personalized advice

```
TRIGGER: User clicks "Get Daily Advice"
         │
         ▼
┌────────────────────────┐
│   Frontend Request     │
│ POST /dailyadvice/     │
│      generate          │
│ ?babyId=xxx            │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│   App Runner API                       │
│   DailyAdviceController                │
└───────────┬────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│   Gather Context from DynamoDB         │
│                                        │
│  1. Get Baby Profile                   │
│     • Name: Aarav                      │
│     • Age: 3 months                    │
│     • Gender: Male                     │
│                                        │
│  2. Get Recent Journal Entries (7 days)│
│     • Entry 1: "Tired, baby crying"    │
│     • Entry 2: "Mother-in-law stress"  │
│     • Entry 3: "Better day today"      │
│                                        │
│  3. Get Mental Health Assessment       │
│     • Risk Score: 52/100               │
│     • Risk Level: Moderate             │
│     • Key concerns: Sleep, family      │
└───────────┬────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│   Build AI Prompt                      │
│                                        │
│  Context:                              │
│  - Baby: Aarav, 3 months old           │
│  - Recent mood: Mixed (some negative)  │
│  - Concerns: Sleep deprivation,        │
│    family stress                       │
│  - Cultural: Indian, joint family      │
│  - Language: Hinglish preferred        │
│  - Season: Diwali approaching          │
│                                        │
│  Instructions:                         │
│  - Generate warm, empathetic advice    │
│  - Include age-appropriate tips        │
│  - Use Hinglish phrases naturally      │
│  - Address specific concerns           │
│  - Keep culturally relevant            │
└───────────┬────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│   Amazon Bedrock                       │
│   Model: Meta Llama 3 70B              │
│                                        │
│   Processing:                          │
│   • Analyzes all context               │
│   • Generates personalized response    │
│   • Ensures cultural appropriateness   │
│   • Adds Hinglish phrases              │
│   • Includes actionable tips           │
│                                        │
│   Generation Time: 2-3 seconds         │
└───────────┬────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│   Generated Advice Example:            │
│                                        │
│   "Namaste Priya! 🌸                   │
│                                        │
│   Achha hai that you're taking time    │
│   to reflect. For Aarav (3 months),    │
│   sleep patterns are still developing. │
│                                        │
│   Here's what can help:                │
│   1. Watch for sleep cues              │
│   2. Try 5-5-5 routine                 │
│   3. During Diwali, keep one room      │
│      quiet for baby                    │
│                                        │
│   I noticed you mentioned family       │
│   stress. Can dadi help with one       │
│   feeding? Thoda sa rest is important! │
│                                        │
│   You're doing great, mama! 💕"        │
└───────────┬────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│   Run Mental Health Check              │
│   (in parallel)                        │
│   • Get risk assessment                │
│   • Generate summary                   │
│   • Risk: 52/100 (Moderate)            │
└───────────┬────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│   Combine Response                     │
│   {                                    │
│     "advice": "Namaste Priya...",      │
│     "mentalHealthSummary": {           │
│       "riskScore": 52,                 │
│       "riskLevel": "Moderate",         │
│       "message": "Monitor closely"     │
│     }                                  │
│   }                                    │
└───────────┬────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────┐
│   Return to User                       │
│   • Display advice with formatting     │
│   • Show mental health summary         │
│   • Highlight Hinglish phrases         │
│   • Add cultural emoji/icons           │
└────────────────────────────────────────┘
            │
            ▼
         END

Total Time: ~3-4 seconds
```

### Highlight:
- "Considers 10+ data points"
- "Generates unique advice every time"
- "Culturally intelligent responses"


---

## 👥 Diagram 5: Use Case Diagram

### Purpose: Show all user interactions with the system

```
                    Smart Parenting Assistant
                    ┌─────────────────────────┐
                    │                         │
        ┌───────────┤    Authentication       │
        │           │                         │
        │           └─────────────────────────┘
        │                     │
        │           ┌─────────┴─────────┐
        │           │                   │
        ▼           ▼                   ▼
    ┌────────┐  ┌────────┐        ┌────────┐
    │Register│  │ Login  │        │ Logout │
    └────────┘  └────────┘        └────────┘
        │           │
        └───────┬───┘
                │
                ▼
        ┌─────────────────────────┐
        │   Baby Management       │
        └─────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
    ┌────────┐    ┌────────┐
    │ Create │    │  View  │
    │ Baby   │    │ Babies │
    │Profile │    │        │
    └────────┘    └────────┘
        │
        └───────┬───────────────────────────┐
                │                           │
                ▼                           │
        ┌─────────────────────────┐        │
        │   Journal Management    │        │
        └─────────────────────────┘        │
                │                           │
        ┌───────┴───────┬───────────┐      │
        │               │           │      │
        ▼               ▼           ▼      │
    ┌────────┐    ┌────────┐  ┌────────┐  │
    │ Write  │    │ Voice  │  │  View  │  │
    │Journal │    │Journal │  │History │  │
    │(Type)  │    │(Speak) │  │        │  │
    └────┬───┘    └────┬───┘  └────────┘  │
         │             │                   │
         └──────┬──────┘                   │
                │                          │
                ▼                          │
        ┌─────────────────────────┐       │
        │  Sentiment Analysis     │       │
        │  (Automatic)            │       │
        └─────────────────────────┘       │
                │                          │
                ▼                          │
        ┌─────────────────────────┐       │
        │   Red Flag Detection    │       │
        │   (Automatic)           │       │
        └─────────────────────────┘       │
                │                          │
                └──────────────────────────┤
                                           │
                ▼                          │
        ┌─────────────────────────┐       │
        │   Daily Advice          │       │
        └─────────────────────────┘       │
                │                          │
        ┌───────┴───────┐                 │
        │               │                 │
        ▼               ▼                 │
    ┌────────┐    ┌────────┐             │
    │Generate│    │  View  │             │
    │ Advice │    │History │             │
    └────────┘    └────────┘             │
        │                                 │
        └─────────────────────────────────┤
                                          │
                ▼                         │
        ┌─────────────────────────┐      │
        │  Mental Health          │      │
        │  Assessment             │      │
        └─────────────────────────┘      │
                │                         │
        ┌───────┴───────┬─────────┐      │
        │               │         │      │
        ▼               ▼         ▼      │
    ┌────────┐    ┌────────┐ ┌────────┐ │
    │  View  │    │  View  │ │ Access │ │
    │  Risk  │    │ Trends │ │Crisis  │ │
    │ Score  │    │(Chart) │ │Help    │ │
    └────────┘    └────────┘ └────────┘ │
        │                                │
        └────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  Actors:                                         │
│  👤 Mother (Primary User)                        │
│  🤖 AI System (Automated Processes)              │
│  🔔 Alert System (Notifications)                 │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  Key Features:                                   │
│  • 6 main use case categories                    │
│  • 15+ user interactions                         │
│  • 3 automated AI processes                      │
│  • Real-time sentiment analysis                  │
│  • Proactive risk detection                      │
└──────────────────────────────────────────────────┘
```

### Use Case Descriptions:

**UC1: Register**
- Actor: Mother
- Description: Create new account with email, password, name
- AWS Service: Amazon Cognito

**UC2: Login**
- Actor: Mother
- Description: Authenticate and receive JWT token
- AWS Service: Amazon Cognito

**UC3: Create Baby Profile**
- Actor: Mother
- Description: Add baby's name, date of birth, gender
- AWS Service: Amazon DynamoDB

**UC4: Write Journal (Type)**
- Actor: Mother
- Description: Type journal entry about feelings
- AWS Service: Amazon DynamoDB, Amazon Comprehend

**UC5: Voice Journal (Speak)**
- Actor: Mother
- Description: Speak journal entry hands-free
- AWS Service: Amazon Transcribe, Amazon Comprehend

**UC6: View Journal History**
- Actor: Mother
- Description: See past entries with sentiment badges
- AWS Service: Amazon DynamoDB

**UC7: Generate Daily Advice**
- Actor: Mother
- Description: Get AI-generated personalized parenting tips
- AWS Service: Amazon Bedrock, Amazon DynamoDB

**UC8: View Mental Health Risk Score**
- Actor: Mother
- Description: See current risk assessment (0-100)
- AWS Service: Amazon DynamoDB, AI Analysis

**UC9: View Mood Trends**
- Actor: Mother
- Description: See 7-day or 30-day sentiment chart
- AWS Service: Amazon DynamoDB

**UC10: Access Crisis Help**
- Actor: Mother
- Description: View emergency helplines and resources
- AWS Service: Static content

**UC11: Sentiment Analysis (Automatic)**
- Actor: AI System
- Description: Analyze emotional tone of journal entries
- AWS Service: Amazon Comprehend

**UC12: Red Flag Detection (Automatic)**
- Actor: AI System
- Description: Detect crisis keywords and alert user
- AWS Service: Pattern matching + Amazon Comprehend

**UC13: Risk Assessment (Automatic)**
- Actor: AI System
- Description: Calculate postpartum depression risk score
- AWS Service: AI Analysis Engine


---

## 🔐 Diagram 6: Authentication & Security Flow

### Purpose: Show how user authentication works with Cognito

```
┌────────────────────────────────────────────────────────┐
│                  REGISTRATION FLOW                      │
└────────────────────────────────────────────────────────┘

User enters:                    Frontend validates:
• Email                         • Email format
• Password                      • Password strength (8+ chars)
• Name                          • Required fields
• Location (optional)
    │                               │
    └───────────┬───────────────────┘
                │
                ▼
        POST /api/v1/auth/register
                │
                ▼
        ┌───────────────────┐
        │   App Runner API  │
        │  AuthController   │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │  Amazon Cognito   │
        │  CreateUser API   │
        └─────────┬─────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
    Success             Error
    │                   │
    │                   └─→ Return error
    │                       (User exists, etc.)
    ▼
Generate JWT Token
    │
    ▼
┌───────────────────┐
│  JWT Token        │
│  {                │
│    "sub": "abc123"│
│    "email": "..." │
│    "exp": ...     │
│  }                │
└─────────┬─────────┘
          │
          ▼
    Save to DynamoDB
    (Users Table)
          │
          ▼
    Return to User:
    • Token
    • UserId
    • Email
    • Name

┌────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                           │
└────────────────────────────────────────────────────────┘

User enters:                    Frontend validates:
• Email                         • Email format
• Password                      • Required fields
    │                               │
    └───────────┬───────────────────┘
                │
                ▼
        POST /api/v1/auth/login
                │
                ▼
        ┌───────────────────┐
        │   App Runner API  │
        │  AuthController   │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │  Amazon Cognito   │
        │  InitiateAuth API │
        │  (USER_PASSWORD)  │
        └─────────┬─────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
    Success             Error
    │                   │
    │                   └─→ Return 401
    │                       (Invalid credentials)
    ▼
Generate JWT Token
    │
    ▼
    Return to User:
    • Token
    • UserId
    • Email
    • Name
    │
    ▼
Frontend stores:
• localStorage.setItem('authToken', token)
• localStorage.setItem('userId', userId)

┌────────────────────────────────────────────────────────┐
│              AUTHENTICATED API CALL FLOW                │
└────────────────────────────────────────────────────────┘

User makes request:
GET /api/v1/journal/entries
    │
    ▼
Frontend adds header:
Authorization: Bearer eyJhbGc...
    │
    ▼
┌───────────────────┐
│   App Runner API  │
│  JWT Middleware   │
└─────────┬─────────┘
          │
          ▼
    Validate Token:
    • Check signature
    • Check expiration
    • Extract userId (sub claim)
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
Valid       Invalid
│           │
│           └─→ Return 401
│               (Unauthorized)
▼
Extract userId
from token
│
▼
Pass to Controller
│
▼
Controller uses userId
to query DynamoDB
│
▼
Return user's data only
(data isolation)

┌────────────────────────────────────────────────────────┐
│                  SECURITY FEATURES                      │
└────────────────────────────────────────────────────────┘

1. Password Security:
   • Hashed by Cognito (bcrypt)
   • Never stored in plaintext
   • Minimum 8 characters

2. JWT Tokens:
   • Signed by Cognito
   • Short expiration (1 hour)
   • Contains minimal claims

3. HTTPS Only:
   • All API calls encrypted
   • TLS 1.2+

4. Data Isolation:
   • UserId from token
   • Users can only access their own data
   • DynamoDB queries filtered by userId

5. CORS Protection:
   • Configured for Amplify domain only
   • Prevents unauthorized origins
```


---

## 📊 Diagram 7: Data Flow Diagram

### Purpose: Show how data moves through the system

```
┌─────────────────────────────────────────────────────────┐
│                    DATA SOURCES                          │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    ┌────────┐          ┌────────┐          ┌────────┐
    │ User   │          │ Baby   │          │Journal │
    │ Input  │          │ Profile│          │ Entry  │
    │(Text/  │          │ Data   │          │ Text   │
    │Voice)  │          │        │          │        │
    └───┬────┘          └───┬────┘          └───┬────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              DATA PROCESSING LAYER                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  1. Data Validation                               │  │
│  │     • Check required fields                       │  │
│  │     • Validate formats                            │  │
│  │     • Sanitize inputs                             │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│                     ▼                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  2. Data Transformation                           │  │
│  │     • Voice → Text (Transcribe)                   │  │
│  │     • Add timestamps                              │  │
│  │     • Generate IDs                                │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│                     ▼                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  3. AI Analysis                                   │  │
│  │     • Sentiment Analysis (Comprehend)             │  │
│  │     • Pattern Detection                           │  │
│  │     • Risk Calculation                            │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│                     ▼                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  4. Data Enrichment                               │  │
│  │     • Add sentiment scores                        │  │
│  │     • Add red flag indicators                     │  │
│  │     • Calculate derived metrics                   │  │
│  └──────────────────┬───────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  DATA STORAGE                            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Amazon DynamoDB Tables                    │  │
│  │                                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Users        │  │ BabyProfiles │             │  │
│  │  ├──────────────┤  ├──────────────┤             │  │
│  │  │ PK: userId   │  │ PK: babyId   │             │  │
│  │  │ • email      │  │ • name       │             │  │
│  │  │ • name       │  │ • dob        │             │  │
│  │  │ • location   │  │ • gender     │             │  │
│  │  │ • createdAt  │  │ • userId     │             │  │
│  │  └──────────────┘  └──────────────┘             │  │
│  │                                                   │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │ JournalEntries                            │   │  │
│  │  ├──────────────────────────────────────────┤   │  │
│  │  │ PK: userId                                │   │  │
│  │  │ SK: timestamp                             │   │  │
│  │  │ GSI: date-index (userId + date)           │   │  │
│  │  │ • content                                 │   │  │
│  │  │ • mood                                    │   │  │
│  │  │ • babyId                                  │   │  │
│  │  │ • sentimentResult {                       │   │  │
│  │  │     sentiment: "NEGATIVE",                │   │  │
│  │  │     scores: {...},                        │   │  │
│  │  │     confidence: 0.87                      │   │  │
│  │  │   }                                       │   │  │
│  │  │ • redFlags {                              │   │  │
│  │  │     hasRedFlags: true,                    │   │  │
│  │  │     keywords: [...],                      │   │  │
│  │  │     riskLevel: "High"                     │   │  │
│  │  │   }                                       │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  │                                                   │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │ MoodAnalysis                              │   │  │
│  │  ├──────────────────────────────────────────┤   │  │
│  │  │ PK: userId                                │   │  │
│  │  │ SK: analysisDate                          │   │  │
│  │  │ • riskScore (0-100)                       │   │  │
│  │  │ • riskLevel (Low/Moderate/High/Critical)  │   │  │
│  │  │ • riskFactors: [...]                      │   │  │
│  │  │ • protectiveFactors: [...]                │   │  │
│  │  │ • recommendations: [...]                  │   │  │
│  │  │ • entriesAnalyzed: 12                     │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  DATA RETRIEVAL                          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Query Patterns:                                  │  │
│  │                                                   │  │
│  │  1. Get User's Journal Entries                   │  │
│  │     Query: userId = "abc123"                     │  │
│  │     Sort: timestamp DESC                         │  │
│  │     Limit: 50                                    │  │
│  │                                                   │  │
│  │  2. Get Entries by Date Range                    │  │
│  │     GSI Query: userId = "abc123"                 │  │
│  │     AND date BETWEEN "2026-02-15" AND "2026-03-01"│  │
│  │                                                   │  │
│  │  3. Get Latest Risk Assessment                   │  │
│  │     Query: userId = "abc123"                     │  │
│  │     Sort: analysisDate DESC                      │  │
│  │     Limit: 1                                     │  │
│  │                                                   │  │
│  │  4. Get Baby Profiles                            │  │
│  │     Query: userId = "abc123"                     │  │
│  │     (via GSI or filter)                          │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  DATA PRESENTATION                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Frontend Display:                                │  │
│  │                                                   │  │
│  │  • Dashboard: Risk score, recent entries         │  │
│  │  • Journal History: List with sentiment badges   │  │
│  │  • Mood Trends: Chart visualization              │  │
│  │  • Daily Advice: Formatted text with Hinglish    │  │
│  │  • Mental Health: Risk assessment details        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  DATA LIFECYCLE                          │
└─────────────────────────────────────────────────────────┘

1. Creation:
   • User input → Validation → Transformation → Storage
   • Time: <1 second

2. Analysis:
   • Retrieve → AI Processing → Update with results
   • Time: 1-3 seconds

3. Retrieval:
   • Query DynamoDB → Format → Return to user
   • Time: <100ms

4. Aggregation:
   • Fetch multiple entries → Calculate trends → Display
   • Time: <500ms

5. Retention:
   • Data stored indefinitely (user can delete)
   • No automatic expiration
   • User owns their data
```

### Key Data Metrics:
- **Storage:** ~5KB per journal entry
- **Query Speed:** <50ms for single item, <200ms for range
- **Throughput:** Handles 1000+ concurrent users
- **Scalability:** Auto-scales with DynamoDB on-demand


---

## 🎨 How to Create These Diagrams

### Recommended Tools:

1. **draw.io (diagrams.net)** - Free, web-based
   - Best for: Architecture diagrams, flowcharts
   - Has AWS icon library built-in
   - Export as PNG, SVG, PDF

2. **Lucidchart** - Free tier available
   - Best for: Professional-looking diagrams
   - AWS shapes library
   - Collaboration features

3. **Microsoft PowerPoint** - If you have it
   - Best for: Quick diagrams for presentations
   - Use SmartArt and shapes
   - Easy to customize colors

4. **Excalidraw** - Free, simple
   - Best for: Hand-drawn style diagrams
   - Quick and easy
   - Export as PNG

### Step-by-Step for draw.io:

1. **Go to:** https://app.diagrams.net/
2. **Create New Diagram**
3. **Add AWS Icons:**
   - Click "More Shapes" (bottom left)
   - Search "AWS19" or "AWS"
   - Enable AWS icon libraries
4. **Follow the layouts** in this document
5. **Use these colors:**
   - User Layer: Light Blue (#E3F2FD)
   - Frontend: Green (#C8E6C9)
   - Backend: Orange (#FFE0B2)
   - AWS Services: Purple (#E1BEE7)
   - Database: Yellow (#FFF9C4)
6. **Export:**
   - File → Export as → PNG
   - Choose resolution: 300 DPI for print
   - Transparent background: Optional

### Tips for Great Diagrams:

1. **Keep it Simple**
   - Don't overcrowd
   - Use white space
   - Group related items

2. **Use Consistent Colors**
   - Same color for same type of component
   - AWS services in purple
   - Data flow in one color

3. **Add Labels**
   - Service names
   - Data formats
   - Timing information
   - Key metrics

4. **Show Data Flow**
   - Use arrows
   - Number the steps
   - Add timing annotations

5. **Make it Readable**
   - Large enough fonts (12pt minimum)
   - High contrast
   - Clear hierarchy

### For PowerPoint Presentations:

1. **One diagram per slide**
2. **Add title:** "Smart Parenting Assistant - Architecture"
3. **Add legend** if using colors
4. **Animate** the flow (optional):
   - Show components appearing one by one
   - Highlight data flow with animations
5. **Add speaker notes** explaining each part

---

## 📐 Diagram Dimensions

### For PPT Slides:
- **Size:** 1920 x 1080 pixels (16:9)
- **Resolution:** 300 DPI
- **Format:** PNG with transparent background

### For Documentation:
- **Size:** 1200 x 800 pixels
- **Resolution:** 150 DPI
- **Format:** PNG or SVG

### For Printing:
- **Size:** 3000 x 2000 pixels
- **Resolution:** 300 DPI
- **Format:** PNG or PDF

---

## 🎯 Which Diagrams to Use Where

### In PPT Presentation:
1. **Slide 1:** High-Level Architecture (Diagram 1)
   - Shows all 6 AWS services
   - Easy to understand overview

2. **Slide 2:** Journal Entry Flow (Diagram 2)
   - Shows AI in action
   - Demonstrates real-time processing

3. **Slide 3:** Mental Health Assessment (Diagram 3)
   - Shows advanced AI capability
   - Highlights early detection

### In Video Demo:
- Use **Diagram 1** as intro
- Show **Diagram 4** when demonstrating daily advice
- Reference **Diagram 5** for feature overview

### In GitHub README:
- **Diagram 1:** Architecture overview
- **Diagram 7:** Data flow
- **Diagram 5:** Use cases

### In Documentation:
- All diagrams for complete technical reference

---

## 🚀 Quick Start Checklist

- [ ] Choose tool (draw.io recommended)
- [ ] Download AWS icon library
- [ ] Create Diagram 1 (Architecture) - PRIORITY
- [ ] Create Diagram 2 (Journal Flow) - PRIORITY
- [ ] Create Diagram 5 (Use Cases) - PRIORITY
- [ ] Export as PNG (300 DPI)
- [ ] Add to PPT slides
- [ ] Add to GitHub README
- [ ] Test readability on projector/screen

---

## 💡 Pro Tips

1. **Start with Diagram 1** - It's the most important
2. **Use templates** - draw.io has AWS architecture templates
3. **Keep text minimal** - Diagrams should be self-explanatory
4. **Test on mobile** - Ensure it's readable on small screens
5. **Version control** - Save source files (.drawio) for edits

---

Good luck creating your diagrams! These will make your presentation stand out! 🎨

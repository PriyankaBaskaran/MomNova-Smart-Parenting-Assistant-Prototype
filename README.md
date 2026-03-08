# 🍼 Smart Parenting Assistant

<div align="center">

![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20Comprehend%20%7C%20Cognito-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**AI-powered parenting companion with sentiment analysis, mood tracking, and culturally-aware guidance**

[Live Demo](https://master.d24lg24gqtj5pf.amplifyapp.com/)  • [API Docs](https://y3vmpncgmc.ap-south-1.awsapprunner.com/swagger/index.html)

</div>

---

## 🌟 Overview

Smart Parenting Assistant is an intelligent companion for new parents that combines emotional wellness tracking, AI-powered advice, and mental health monitoring. Using AWS AI services, it provides personalized, culturally-relevant support for the parenting journey.

### Why This Matters

- **70% of new parents** experience anxiety and stress
- **1 in 7 mothers** suffer from postpartum depression
- **Limited access** to personalized parenting guidance in India
- **Cultural gap** in generic parenting advice

### Our Solution

AI-powered platform that:
- ✅ Tracks emotional wellness through journaling
- ✅ Detects mental health red flags early
- ✅ Provides culturally-aware, personalized advice
- ✅ Supports English, Hindi, and Hinglish
- ✅ Monitors baby development milestones

---

## 🎯 Key Features

### 📝 Emotional Wellness Tracking
- Journal entries with real-time sentiment analysis
- Multilingual support (English, Hindi, Hinglish)
- Mood trend visualization and analytics
- Historical emotional journey tracking

### 🚨 Mental Health Monitoring
- AI-powered red flag detection
- Crisis keyword identification
- Emergency resource recommendations
- Postpartum depression early warning

### 🤖 Personalized AI Advice
- Context-aware parenting tips
- Baby age-specific guidance
- Cultural intelligence (Indian traditions)
- Powered by AWS Bedrock (Meta Llama 3 70B)

### 👶 Baby Development Tracking
- Milestone monitoring
- Growth tracking
- Vaccination reminders
- Development insights

### 📊 Analytics & Insights
- Mood trend analysis
- Sentiment score tracking
- Weekly/monthly reports
- Pattern recognition

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │
│  (TypeScript)   │
└────────┬────────┘
         │ HTTPS/REST
         ▼
┌─────────────────────────────────────────┐
│         .NET 8 Web API                  │
│  (Clean Architecture + CQRS/MediatR)    │
└────────┬────────────────────────────────┘
         │
    ┌────┴────┬──────────┬──────────┬─────────┐
    ▼         ▼          ▼          ▼         ▼
┌────────┐ ┌──────┐ ┌─────────┐ ┌────────┐ ┌─────┐
│Bedrock │ │Compre│ │ Cognito │ │DynamoDB│ │ ECR │
│(Llama3)│ │ hend │ │  (Auth) │ │ (NoSQL)│ │     │
└────────┘ └──────┘ └─────────┘ └────────┘ └─────┘
```

### Tech Stack

**Backend**
- .NET 8, ASP.NET Core Web API
- Clean Architecture (Domain, Application, Infrastructure)
- CQRS with MediatR
- AWS SDK for .NET
- Semantic Kernel (AI orchestration)
- Docker containerization

**Frontend** *(Coming Soon)*
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Query (data fetching)
- Zustand (state management)
- Recharts (analytics visualization)

**AWS Services**
- **Amazon Bedrock**: AI chat completion (Meta Llama 3 70B)
- **Amazon Comprehend**: Multilingual sentiment analysis
- **Amazon Cognito**: User authentication & management
- **Amazon DynamoDB**: NoSQL database
- **AWS App Runner**: Containerized deployment
- **Amazon ECR**: Container registry

---

## 📁 Repository Structure

```
smart-parenting-assistant/
│
├── backend/                          # .NET 8 Web API
│   ├── src/
│   │   ├── SmartParentingAssistant.API/
│   │   │   ├── Controllers/          # REST API endpoints
│   │   │   ├── Program.cs            # App configuration
│   │   │   └── appsettings.json      # Configuration
│   │   │
│   │   ├── SmartParentingAssistant.Application/
│   │   │   ├── Features/             # CQRS Commands/Queries
│   │   │   ├── DTOs/                 # Data transfer objects
│   │   │   └── Interfaces/           # Service contracts
│   │   │
│   │   ├── SmartParentingAssistant.Domain/
│   │   │   ├── Entities/             # Domain models
│   │   │   └── ValueObjects/         # Value objects
│   │   │
│   │   ├── SmartParentingAssistant.Infrastructure/
│   │   │   ├── AI/                   # AWS Bedrock, Comprehend
│   │   │   ├── Identity/             # Cognito integration
│   │   │   ├── Persistence/          # DynamoDB repositories
│   │   │   └── Prompts/              # AI prompt templates
│   │   │
│   │   └── SmartParentingAssistant.Shared/
│   │
│   ├── tests/                        # Unit & Integration tests
│   ├── scripts/                      # Setup & deployment scripts
│   ├── Dockerfile                    # Container configuration
│   └── README.md
│
├── frontend/                         # React + TypeScript (Coming Soon)
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API client
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── store/                    # State management
│   │   └── utils/                    # Helper functions
│   │
│   ├── public/                       # Static assets
│   └── README.md
│
├── docs/                             # Documentation
│   ├── AWS-SETUP-GUIDE.md
│   ├── COGNITO-SETUP-GUIDE.md
│   ├── DEPLOYMENT-GUIDE.md
│   ├── API-DOCUMENTATION.md
│   └── ARCHITECTURE-DIAGRAMS.md
│
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **AWS Account** - [Sign up](https://aws.amazon.com/)
- **AWS CLI** - [Install](https://aws.amazon.com/cli/)
- **Docker** (optional) - [Install](https://www.docker.com/get-started)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/smart-parenting-assistant.git
cd smart-parenting-assistant
```

### 2️⃣ AWS Setup

**Configure AWS CLI:**
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: ap-south-1 (Mumbai)
# Default output format: json
```

### 3️⃣ Create AWS Resources

**Create DynamoDB Tables:**
```powershell
cd backend
.\scripts\setup-dynamodb-tables.ps1
```

**Create Cognito User Pool:**

- User Pool ID
- App Client ID
- App Client Secret

### 4️⃣ Configure Application

Edit `backend/src/SmartParentingAssistant.API/appsettings.json`:

```json
{
  "AWS": {
    "Region": "ap-south-1",
    "BedrockModelId": "meta.llama3-70b-instruct-v1:0",
    "Cognito": {
      "UserPoolId": "ap-south-1_XXXXXXXXX",
      "AppClientId": "your-app-client-id",
      "AppClientSecret": "your-app-client-secret",
      "Region": "ap-south-1"
    }
  }
}
```

### 5️⃣ Run Backend

```bash
cd backend
dotnet restore
dotnet run --project src/SmartParentingAssistant.API
```

API will be available at: `https://localhost:5001/swagger`

### 6️⃣ Run Frontend *(Coming Soon)*

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |

### Journal Entries (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/journal/entries` | Create journal entry with sentiment analysis |
| GET | `/api/v1/journal/entries` | Get user's journal entries |
| GET | `/api/v1/journal/entries?startDate=2024-01-01&endDate=2024-12-31` | Get entries by date range |

### Analytics (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analytics/mood-trends` | Get mood trend analytics |
| GET | `/api/v1/analytics/mood-trends?days=30` | Get trends for specific period |

### Baby Management (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/baby` | Create baby profile |
| GET | `/api/v1/baby` | Get user's baby profiles |
| GET | `/api/v1/baby/{id}` | Get specific baby profile |
| PUT | `/api/v1/baby/{id}` | Update baby profile |

### AI Advice (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/advice/daily` | Generate personalized daily advice |
| POST | `/api/v1/advice/assessment` | Get advice with mental health assessment |

**Full API Documentation:** [Swagger UI](https://y3vmpncgmc.ap-south-1.awsapprunner.com/swagger/index.html) when running locally

---

## 🎨 Example Usage

### Register User

```bash
curl -X POST "https://localhost:5001/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "SecurePass123!",
    "name": "Priya Sharma"
  }'
```

### Create Journal Entry

```bash
curl -X POST "https://localhost:5001/api/v1/journal/entries" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Baby slept through the night! Feeling so grateful and rested.",
    "mood": "Happy",
    "babyId": "baby-id-here"
  }'
```

**Response:**
```json
{
  "id": "entry-id",
  "content": "Baby slept through the night! Feeling so grateful and rested.",
  "mood": "Happy",
  "sentiment": "POSITIVE",
  "sentimentScores": {
    "positive": 0.98,
    "negative": 0.01,
    "neutral": 0.01,
    "mixed": 0.00
  },
  "confidenceScore": 0.98,
  "language": "en",
  "hasRedFlags": false,
  "createdAt": "2024-03-08T10:30:00Z"
}
```

---

## 🧪 Testing

### Run Unit Tests

```bash
cd backend
dotnet test tests/SmartParentingAssistant.UnitTests
```

### Run Integration Tests

```bash
dotnet test tests/SmartParentingAssistant.IntegrationTests
```

### Test Journal Entries

Use the provided test script:
```powershell
.\test-journal-entries.ps1
```

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build image
docker build -t smart-parenting-api ./backend

# Run container
docker run -p 8080:8080 \
  -e AWS__Region=ap-south-1 \
  -e AWS__Cognito__UserPoolId=your-pool-id \
  smart-parenting-api
```

### AWS App Runner Deployment

**Quick Deploy:**
```powershell
cd backend
.\deploy-now.ps1
```

---

## 🎯 AWS AI for Bharat Hackathon

### Why AI is Required

Traditional parenting resources are:
- ❌ Generic and not personalized
- ❌ Culturally disconnected
- ❌ Unable to detect mental health issues
- ❌ Not available 24/7

**AI transforms this by:**
- ✅ Personalizing advice based on context
- ✅ Understanding cultural nuances
- ✅ Detecting emotional patterns
- ✅ Providing instant, intelligent support

### How AWS Services Are Used

| Service | Purpose | Value Added |
|---------|---------|-------------|
| **Amazon Bedrock** | AI chat completion | Generates culturally-aware, personalized parenting advice |
| **Amazon Comprehend** | Sentiment analysis | Detects emotional state in 100+ languages including Hindi |
| **Amazon Cognito** | Authentication | Secure, scalable user management |
| **Amazon DynamoDB** | Database | Fast, flexible NoSQL storage for user data |
| **AWS App Runner** | Deployment | Automatic scaling and container management |

### What Value AI Adds

1. **Personalization at Scale**: Each parent gets advice tailored to their baby's age, their emotional state, and cultural context
2. **Early Intervention**: AI detects mental health red flags before they become crises
3. **Cultural Intelligence**: Understands Indian parenting practices, festivals, and traditions
4. **24/7 Availability**: Always-on support when parents need it most
5. **Multilingual Support**: Breaks language barriers with English, Hindi, and Hinglish

---

## 🗺️ Roadmap

### Phase 1: MVP ✅
- [x] User authentication (Cognito)
- [x] Journal entries with sentiment analysis
- [x] Baby profile management
- [x] AI-powered advice generation
- [x] Red flag detection
- [x] Mood trend analytics

### Phase 2: Enhanced Features 🚧
- [ ] React frontend with beautiful UI
- [ ] Real-time notifications
- [ ] Community features
- [ ] Vaccination tracking
- [ ] Milestone photo uploads
- [ ] Voice journal entries

### Phase 3: Advanced AI 🔮
- [ ] Predictive analytics for baby needs
- [ ] Sleep pattern analysis
- [ ] Feeding schedule optimization
- [ ] Growth prediction models
- [ ] Personalized milestone tracking

### Phase 4: Community & Scale 🌍
- [ ] Parent community forums
- [ ] Expert Q&A sessions
- [ ] Regional language support
- [ ] Mobile apps (iOS/Android)
- [ ] Wearable device integration

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for new parents everywhere

- **Developer**: [Priyanga](https://github.com/PriyankaBaskaran)
- **Developer**: [Chandran](https://github.com/PriyankaBaskaran)


---

## 🙏 Acknowledgments

- AWS for providing amazing AI services
- The open-source community
- All the parents who inspired this project
- AWS AI for Bharat Hackathon organizers

---

## 📞 Support

- 📧 Email: support@smartparenting.com
- 🐛 Issues: [GitHub Issues](../../issues)
- 💬 Discussions: [GitHub Discussions](../../discussions)
- 📖 Documentation: [docs/](./docs/)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ using AWS AI Services

</div>

# AWS Architecture Diagrams - Generated

All architecture diagrams have been successfully generated using AWS Diagram MCP Server!

## 📊 Generated Diagrams

All diagrams are located in the `generated-diagrams/` folder.

### 1. Architecture Overview (155 KB)
**File:** `architecture_overview.png`
**Purpose:** High-level view of all AWS services and their connections
**Shows:**
- User layer
- Frontend (AWS Amplify)
- Backend (AWS App Runner)
- 6 AWS Services (Cognito, Bedrock, Comprehend, Transcribe, DynamoDB)
- Data flow between components

**Use in:** PPT Slide 1, README overview

---

### 2. Journal Flow (161 KB)
**File:** `journal_flow.png`
**Purpose:** Complete journal entry process from input to sentiment analysis
**Shows:**
- Type vs Voice input options
- AWS Transcribe for voice-to-text
- Frontend validation
- Backend API processing
- Sentiment analysis with Comprehend
- Red flag detection
- Results returned to user

**Use in:** PPT Slide 2, Feature demo

---

### 3. Risk Assessment Flow (186 KB)
**File:** `risk_assessment_flow.png`
**Purpose:** Mental health risk assessment AI process
**Shows:**
- User request flow
- DynamoDB query for 14 days of data
- AI Risk Analysis Engine
- Pattern detection
- Score calculation (0-100)
- Bedrock for intervention advice
- Results storage and return

**Use in:** PPT Slide 3, AI capabilities demo

---

### 4. Daily Advice Flow (139 KB)
**File:** `daily_advice_flow.png`
**Purpose:** How AI generates personalized daily advice
**Shows:**
- User trigger
- Context gathering (baby profile, journals, assessment)
- AI prompt building
- Bedrock (Llama 3) generation
- Personalized advice return

**Use in:** Feature documentation, AI demo

---

### 5. Auth & Security Flow (196 KB)
**File:** `auth_security_flow.png`
**Purpose:** Complete authentication and security architecture
**Shows:**
- Registration flow
- Login flow
- Authenticated API calls
- JWT token handling
- Cognito integration
- Data isolation

**Use in:** Security documentation, Technical review

---

### 6. Data Flow (145 KB)
**File:** `data_flow.png`
**Purpose:** How data moves through the entire system
**Shows:**
- User interactions
- Frontend (React/Next.js)
- Backend API
- AI processing pipeline
- 4 DynamoDB tables
- Complete data flow

**Use in:** Technical documentation, Architecture review

---

### 7. Deployment Architecture (161 KB)
**File:** `deployment_architecture.png`
**Purpose:** Production deployment setup in AWS
**Shows:**
- AWS Region: ap-south-1 (Mumbai)
- Frontend: Amplify + CloudFront + S3
- Backend: App Runner with auto-scaling
- Security: Cognito + IAM
- AI Services: Bedrock, Comprehend, Transcribe
- Database: DynamoDB with monitoring

**Use in:** DevOps documentation, Deployment guide

---

### 8. System Overview (147 KB)
**File:** `system_overview.png`
**Purpose:** Simplified system architecture
**Shows:**
- Users (mobile & desktop)
- Frontend apps
- REST API
- AWS services
- Database tables

**Use in:** Quick reference, Executive summary

---

### 9. User Journey (209 KB)
**File:** `user_journey.png`
**Purpose:** Complete user journey from registration to insights
**Shows:**
- 6-step user flow
- Registration → Baby Profile → Journal → Advice → Assessment → Dashboard
- Services used at each step

**Use in:** User experience documentation, Product demo

---

## 🎯 Recommended Usage

### For PowerPoint Presentation:
1. **Slide 1:** `architecture_overview.png` - Show all AWS services
2. **Slide 2:** `journal_flow.png` - Demonstrate AI in action
3. **Slide 3:** `risk_assessment_flow.png` - Highlight early detection
4. **Slide 4:** `user_journey.png` - Show complete user experience

### For GitHub README:
- `system_overview.png` - Quick architecture reference
- `deployment_architecture.png` - Deployment details

### For Documentation:
- All diagrams for complete technical reference

### For Video Demo:
- `user_journey.png` - Intro
- `daily_advice_flow.png` - Feature demo
- `architecture_overview.png` - Technical overview

---

## 📐 Diagram Specifications

- **Format:** PNG
- **Resolution:** High quality (suitable for presentations)
- **Size:** 139 KB - 209 KB per diagram
- **Total:** 10 diagrams, ~1.6 MB total
- **Color Scheme:** AWS standard colors
- **Layout:** Professional, clean, easy to read

---

## ✅ What's Included

Each diagram shows:
- ✅ AWS service icons (official)
- ✅ Clear data flow arrows
- ✅ Logical grouping with clusters
- ✅ Service labels and descriptions
- ✅ Connection labels where relevant
- ✅ Professional layout

---

## 🚀 Next Steps

1. **Review diagrams** in `generated-diagrams/` folder
2. **Add to PowerPoint** - Drag and drop PNG files
3. **Update README** - Add architecture overview diagram
4. **Share with team** - Use for technical discussions
5. **Update as needed** - Regenerate if architecture changes

---

## 💡 Tips for Presentations

1. **Start with System Overview** - Easiest to understand
2. **Deep dive with specific flows** - Journal, Advice, Assessment
3. **End with Deployment** - Show production readiness
4. **Use animations** - Reveal components one by one in PPT
5. **Add speaker notes** - Explain each AWS service's role

---

All diagrams are ready to use! 🎉

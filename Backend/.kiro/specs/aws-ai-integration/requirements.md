# Requirements: AWS AI Integration for Smart Parenting Assistant

## Reference Documents

This spec references the existing comprehensive requirements:

#[[file:../../../Documents/requirements.md]]

## MVP Scope for Hackathon (6 Days - Focus on 1-2 Days Implementation)

### Critical Requirements for Hackathon Demo

**Priority 1 - Must Have (Core Demo Features):**

1. **Baby Profile Management** (Requirement 2)
   - Create and manage baby profiles
   - Store in AWS DynamoDB
   - Age-appropriate context for AI

2. **Journal Entry with Sentiment Analysis** (Requirements 3 & 4)
   - Text-based journal entries
   - Real-time sentiment analysis using Amazon Comprehend
   - Support English and Hinglish
   - Store sentiment scores and history

3. **AI-Powered Daily Advice** (Requirement 5)
   - Generate personalized advice using Amazon Bedrock (Claude 3)
   - Cultural intelligence (Indian festivals, joint family context)
   - Baby age-appropriate recommendations
   - Hinglish support

4. **Mood Trend Visualization** (Requirement 6)
   - Display 7-day and 30-day mood trends
   - Simple charts showing sentiment patterns
   - Identify concerning patterns (3+ negative days)

**Priority 2 - Should Have (If Time Permits):**

5. **Red Flag Detection** (Requirement 8)
   - Detect severe negative sentiment
   - Display crisis resources
   - Emergency helpline information

**Out of Scope for MVP:**
- User Authentication (Requirement 1) - No MFA, simplified auth or demo mode
- PWA capabilities (Requirement 7)
- Multilingual UI (Requirement 9) - English only for MVP
- Advanced cultural customization (Requirement 10) - Basic only

## Technical Requirements for AWS Migration

### AWS Services Integration

1. **Amazon Bedrock** - AI advice generation
   - Model: Claude 3 Sonnet or Haiku (cost-effective)
   - Region: us-east-1 or ap-south-1 (Mumbai for India focus)
   - Integration via AWS SDK for .NET

2. **Amazon Comprehend** - Sentiment analysis
   - DetectSentiment API
   - Language support: English, Hindi detection
   - Batch processing for efficiency

3. **Amazon DynamoDB** - Database
   - Tables: Users, BabyProfiles, JournalEntries, DailyAdvice, SentimentHistory
   - On-demand billing mode
   - Partition key: userId for data isolation

4. **AWS Lambda** (Optional) - Serverless functions
   - Daily advice generation trigger
   - Sentiment aggregation

5. **Amazon CloudWatch** - Monitoring
   - Basic logging and metrics
   - Error tracking

### Architecture Changes

**Remove:**
- Azure Cognitive Services (Text Analytics)
- Azure OpenAI
- Azure Cosmos DB
- Azure-specific authentication

**Add:**
- AWS SDK for .NET (AWSSDK.BedrockRuntime, AWSSDK.Comprehend, AWSSDK.DynamoDBv2)
- Semantic Kernel with Bedrock connector
- DynamoDB data access layer
- AWS credentials configuration

## Success Criteria for Hackathon

1. **Functional Demo:**
   - Create baby profile ✓
   - Submit journal entry ✓
   - Get sentiment analysis result ✓
   - Generate AI advice ✓
   - View mood trends chart ✓

2. **AWS Integration:**
   - All AI calls go through Amazon Bedrock ✓
   - All sentiment analysis via Amazon Comprehend ✓
   - All data stored in DynamoDB ✓

3. **Cultural Intelligence:**
   - AI advice includes Hinglish phrases ✓
   - Mentions Indian festivals/context ✓
   - Considers joint family dynamics ✓

4. **Performance:**
   - API response < 2 seconds for advice generation
   - Sentiment analysis < 500ms
   - Smooth UI experience

5. **Presentation Ready:**
   - Clean, working demo
   - No crashes or errors
   - Sample data showing trends
   - Compelling story for judges

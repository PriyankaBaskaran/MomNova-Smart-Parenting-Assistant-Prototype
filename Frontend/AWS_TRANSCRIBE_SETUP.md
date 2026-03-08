# AWS Transcribe Setup Guide

This guide will help you set up AWS Transcribe for voice recording in the journal feature.

## Prerequisites

- AWS Account
- IAM User with Transcribe permissions

## Step 1: Create IAM User

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Add users"
3. Enter username (e.g., `smart-parenting-transcribe`)
4. Select "Access key - Programmatic access"
5. Click "Next: Permissions"

## Step 2: Attach Transcribe Policy

1. Click "Attach existing policies directly"
2. Search for and select: `AmazonTranscribeFullAccess`
   - Or create a custom policy with minimal permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "transcribe:StartStreamTranscription"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
3. Click "Next: Tags" (optional)
4. Click "Next: Review"
5. Click "Create user"

## Step 3: Save Credentials

1. **IMPORTANT**: Copy the Access Key ID and Secret Access Key
2. Store them securely - you won't be able to see the secret key again!

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://y3vmpncgmc.ap-south-1.awsapprunner.com/api/v1

# AWS Transcribe Configuration
NEXT_PUBLIC_AWS_REGION=ap-south-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID_HERE
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY_HERE
```

2. Replace `YOUR_ACCESS_KEY_ID_HERE` and `YOUR_SECRET_ACCESS_KEY_HERE` with your actual credentials

## Step 5: Restart Development Server

```bash
npm run dev
```

## Security Notes

⚠️ **IMPORTANT SECURITY CONSIDERATIONS**:

1. **Never commit `.env.local` to Git** - it's already in `.gitignore`
2. **Client-side credentials**: These credentials are exposed in the browser. For production:
   - Use AWS Cognito Identity Pools for temporary credentials
   - Or create a backend proxy endpoint that handles transcription
   - Limit IAM permissions to only `transcribe:StartStreamTranscription`
   - Set up AWS budget alerts to monitor usage

3. **Production Best Practice**:
   ```
   Frontend → Your Backend API → AWS Transcribe
   ```
   This way, AWS credentials stay on the server.

## Supported Languages

The voice recorder supports:
- English (India) - `en-IN`
- Hindi - `hi-IN`
- English (US) - `en-US`
- English (UK) - `en-GB`

## Troubleshooting

### "AWS credentials not configured"
- Make sure `.env.local` exists in project root
- Restart your development server after creating/updating `.env.local`
- Check that variable names start with `NEXT_PUBLIC_`

### "Invalid AWS credentials"
- Verify your Access Key ID and Secret Access Key are correct
- Check that the IAM user has Transcribe permissions
- Ensure there are no extra spaces in the `.env.local` file

### "AWS access denied"
- Verify the IAM user has `AmazonTranscribeFullAccess` or `transcribe:StartStreamTranscription` permission
- Check that the AWS region is correct (should be `ap-south-1`)

### "Microphone permission denied"
- Click the lock icon in your browser's address bar
- Allow microphone access
- Refresh the page

## Cost Estimation

AWS Transcribe Streaming pricing (as of 2024):
- **First 250 million seconds/month**: $0.024 per minute
- **Over 250 million seconds/month**: $0.015 per minute

Example:
- 1 minute recording = $0.024
- 100 recordings of 2 minutes each = $4.80/month
- Free tier: 60 minutes/month for first 12 months

## Testing

1. Go to the Journal page
2. Click "Voice Input"
3. Click the microphone button
4. Allow microphone access
5. Speak naturally
6. Click "Stop Recording"
7. Review the transcription
8. Click "Use Transcription"

The transcribed text will be added to your journal entry!

## Alternative: Web Speech API

If you don't want to use AWS Transcribe, the app also supports the browser's built-in Web Speech API (free, but less accurate for Hindi/Hinglish).

To switch back to Web Speech API, you can keep the `.env.local` file empty or remove the AWS credentials.

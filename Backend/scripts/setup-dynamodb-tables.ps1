# PowerShell script to create DynamoDB tables

Write-Host "Creating DynamoDB tables..." -ForegroundColor Green

# Users Table
Write-Host "`nCreating SmartParenting_Users table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name SmartParenting_Users `
    --attribute-definitions `
        AttributeName=userId,AttributeType=S `
        AttributeName=email,AttributeType=S `
    --key-schema `
        AttributeName=userId,KeyType=HASH `
    --global-secondary-indexes `
        "IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL}" `
    --billing-mode PAY_PER_REQUEST `
    --region ap-south-1

# Journal Entries Table
Write-Host "`nCreating SmartParenting_JournalEntries table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name SmartParenting_JournalEntries `
    --attribute-definitions `
        AttributeName=entryId,AttributeType=S `
        AttributeName=userId,AttributeType=S `
        AttributeName=date,AttributeType=S `
    --key-schema `
        AttributeName=entryId,KeyType=HASH `
    --global-secondary-indexes `
        '[{"IndexName":"userId-index","KeySchema":[{"AttributeName":"userId","KeyType":"HASH"},{"AttributeName":"date","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}}]' `
    --billing-mode PAY_PER_REQUEST `
    --region ap-south-1

# Baby Profiles Table
Write-Host "`nCreating SmartParenting_BabyProfiles table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name SmartParenting_BabyProfiles `
    --attribute-definitions `
        AttributeName=Id,AttributeType=S `
        AttributeName=UserId,AttributeType=S `
    --key-schema `
        AttributeName=Id,KeyType=HASH `
    --global-secondary-indexes `
        "IndexName=userId-index,KeySchema=[{AttributeName=UserId,KeyType=HASH}],Projection={ProjectionType=ALL}" `
    --billing-mode PAY_PER_REQUEST `
    --region ap-south-1

# Mood Analysis Table
Write-Host "`nCreating SmartParenting_MoodAnalysis table..." -ForegroundColor Yellow
aws dynamodb create-table `
    --table-name SmartParenting_MoodAnalysis `
    --attribute-definitions `
        AttributeName=Id,AttributeType=S `
        AttributeName=BabyId,AttributeType=S `
        AttributeName=Date,AttributeType=S `
    --key-schema `
        AttributeName=Id,KeyType=HASH `
    --global-secondary-indexes `
        "IndexName=babyId-index,KeySchema=[{AttributeName=BabyId,KeyType=HASH},{AttributeName=Date,KeyType=RANGE}],Projection={ProjectionType=ALL}" `
    --billing-mode PAY_PER_REQUEST `
    --region ap-south-1

Write-Host "`nDone!" -ForegroundColor Green

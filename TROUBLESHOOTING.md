# AI Fiesta - Database Troubleshooting Guide

This guide helps troubleshoot common issues with the database implementation for chat session storage.

## Common Issues and Solutions

### 1. "Error saving chat session - HTTP Status: 500" 

**Problem**: The API endpoint is returning a 500 Internal Server Error.

**Possible Causes**:
- Database table doesn't exist
- RLS (Row Level Security) policies not configured
- Invalid data format
- Database connection issues
- Missing required fields

**Solutions**:

#### A. Verify Database Table Exists
1. Log into your Supabase dashboard
2. Navigate to the Table Editor
3. Check if `chat_sessions` table exists
4. If not, run the migration script:

```sql
-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  responses JSONB,
  timestamp TIMESTAMPTZ NOT NULL,
  selected_models TEXT[],
  best_response TEXT,
  response_time REAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_timestamp ON chat_sessions(timestamp);
```

#### B. Enable Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only view their own chat sessions
CREATE POLICY "Users can view their own chat sessions" 
ON chat_sessions FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own chat sessions
CREATE POLICY "Users can insert their own chat sessions" 
ON chat_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own chat sessions
CREATE POLICY "Users can update their own chat sessions" 
ON chat_sessions FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only delete their own chat sessions
CREATE POLICY "Users can delete their own chat sessions" 
ON chat_sessions FOR DELETE 
USING (auth.uid() = user_id);
```

#### C. Test Database Connection and Permissions
Use the diagnostic API endpoints:
1. Visit `/api/test-supabase` to check basic Supabase connectivity
2. Visit `/api/check-table` to verify table existence and permissions
3. Visit `/api/test-insert` to test a simple insert operation

#### D. Debug Data Issues
1. Visit `/api/debug-save` and POST a sample session to see detailed error information
2. Check browser console for detailed logs of what data is being sent

#### E. Check Environment Variables
Ensure your `.env` file has the correct Supabase configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Authentication Issues

**Problem**: Users are not properly authenticated when accessing the database.

**Solutions**:
1. Ensure users are logged in before attempting to save chat sessions
2. Check that Supabase Auth is properly configured
3. Verify that the user has a valid session

### 3. Network Issues

**Problem**: API calls to save chat sessions fail due to network connectivity.

**Solutions**:
1. Check your internet connection
2. Verify that the Supabase URL is accessible
3. Check browser console for network errors

### 4. Data Validation Errors

**Problem**: Invalid data format prevents successful insertion.

**Solutions**:
1. Ensure all required fields are present (id, message, timestamp)
2. Verify timestamp is in ISO format
3. Check that arrays are properly formatted

### 5. OpenRouter API Issues

**Problem**: You're seeing an error like `No endpoints found matching your data policy (Free model publication)`.

**Possible Causes**:
- Incorrect or missing OpenRouter API key
- Model IDs not available under your current data policy
- Incorrect model IDs in the application configuration

**Solutions**:

#### A. Verify API Key Configuration
1. Ensure you have created an API key at [https://openrouter.ai/settings/keys](https://openrouter.ai/settings/keys)
2. Check that your `.env` file contains the correct API key:
```env
OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
```

#### B. Check Data Policy Settings
1. Visit [https://openrouter.ai/settings/privacy](https://openrouter.ai/settings/privacy)
2. Ensure that the appropriate data policy is selected for your use case
3. If using "Free model publication", make sure the models you're trying to access support this policy

#### C. Verify Model IDs
1. The application is configured to use free-tier models with generous rate limits:
   - `openai/gpt-3.5-turbo` (no :free suffix, widely available)
   - `openai/gpt-4o-mini` (no :free suffix, widely available)
   - `anthropic/claude-3-haiku:free` (free tier with 20 RPM)
   - `google/gemini-flash:free` (free tier with 20 RPM)
   - `meta-llama/llama-3.1-8b-instruct:free` (free tier with 20 RPM)
   - `mistralai/mistral-7b-instruct:free` (free tier with 20 RPM)
   - `microsoft/phi-3-mini-128k-instruct:free` (free tier with 20 RPM)
   - `teknium/openhermes-2.5-mistral-7b:free` (free tier with 20 RPM)
   - `openrouter/auto` (automatically selects best available model)
2. If you're still having issues, try using the `openrouter/auto` model which automatically selects the best available model

#### D. Understanding Rate Limits
Free models on OpenRouter have the following rate limits:
- Free models (with `:free` suffix): 20 requests per minute, 50-200 requests per day
- To increase limits, purchase credits on OpenRouter (removes most rate limits)
- BYOK (Bring Your Own Key) models have different rate limits

#### E. Test API Access
You can test your API key and model access directly with curl:
```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "meta-llama/llama-3.1-8b-instruct:free",
  "messages": [
    {"role": "user", "content": "Hello"}
  ]
}'
```

## Debugging Steps

### 1. Enable Detailed Logging
The application now includes enhanced logging. Check the browser console for detailed error messages.

### 2. Use Diagnostic API Endpoints
1. `/api/test-supabase` - Tests basic Supabase connectivity
2. `/api/check-table` - Verifies table existence and permissions
3. `/api/test-insert` - Tests a simple insert operation
4. `/api/debug-save` - Debugs data insertion with detailed error info

### 3. Manual Testing
1. Try to access `/api/test-db` directly in your browser
2. Check the response for any error messages
3. Verify you're logged in when accessing the endpoint

### 4. Database Direct Access
1. Use the Supabase SQL Editor to run queries directly
2. Test inserting a sample record:
```sql
INSERT INTO chat_sessions (id, user_id, message, responses, timestamp, selected_models)
VALUES ('test-id', 'your-user-id', 'Test message', '[]', NOW(), '{}');
```

## How to Apply Database Migrations

If you need to manually apply the database schema:

1. Log into your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20251001000000_create_chat_sessions.sql`
4. Run the query

## Fallback Behavior

The application includes localStorage fallback:
- Chat sessions are saved to localStorage as a backup
- If database operations fail, the app continues to work with localStorage
- Data is only saved to the database when online and authenticated

## Need Help?

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are correctly set
3. Ensure your Supabase project is properly configured
4. Contact support with the detailed error logs
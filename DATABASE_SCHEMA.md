# AI Fiesta Database Schema

## Chat Sessions Table

This table stores all AI model comparison sessions for users.

### Table Structure

```sql
CREATE TABLE chat_sessions (
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
```

### Column Descriptions

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Unique identifier for the chat session |
| user_id | UUID | Reference to the user who created the session |
| message | TEXT | The original prompt/message sent to AI models |
| responses | JSONB | Array of responses from different AI models |
| timestamp | TIMESTAMPTZ | When the chat session was created |
| selected_models | TEXT[] | Array of model IDs that were compared |
| best_response | TEXT | (Optional) The model ID marked as best response |
| response_time | REAL | (Optional) Time taken to get all responses in seconds |
| created_at | TIMESTAMPTZ | Timestamp when record was created |

### Indexes

```sql
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_timestamp ON chat_sessions(timestamp);
```

### RLS (Row Level Security) Policies

```sql
-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

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
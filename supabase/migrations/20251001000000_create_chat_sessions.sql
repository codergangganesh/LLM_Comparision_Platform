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

-- Enable Row Level Security (RLS)
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
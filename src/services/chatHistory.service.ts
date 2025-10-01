import { ChatSession } from '@/types/chat'

export class ChatHistoryService {
  async saveChatSession(session: ChatSession): Promise<boolean> {
    try {
      // Log the session data being sent
      console.log('Saving chat session:', JSON.stringify(session, null, 2));
      
      const response = await fetch('/api/chat-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error saving chat session - HTTP Status:', response.status);
        console.error('Error saving chat session - Response text:', errorText);
        try {
          // Only try to parse as JSON if it looks like JSON
          if (errorText.trim().startsWith('{') && errorText.trim().endsWith('}')) {
            const error = JSON.parse(errorText);
            console.error('Error saving chat session - Parsed error:', error);
          } else {
            console.error('Error saving chat session - Non-JSON response:', errorText);
          }
        } catch (e) {
          console.error('Error saving chat session - Could not parse error as JSON:', errorText);
        }
        return false;
      }

      const result = await response.json();
      console.log('Successfully saved chat session:', result);
      return true;
    } catch (error) {
      console.error('Error saving chat session - Network error:', error);
      return false;
    }
  }

  async getChatSessions(): Promise<ChatSession[] | null> {
    try {
      console.log('Fetching chat sessions');
      const response = await fetch('/api/chat-sessions');
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching chat sessions - HTTP Status:', response.status);
        console.error('Error fetching chat sessions - Response text:', errorText);
        try {
          // Only try to parse as JSON if it looks like JSON
          if (errorText.trim().startsWith('{') && errorText.trim().endsWith('}')) {
            const error = JSON.parse(errorText);
            console.error('Error fetching chat sessions - Parsed error:', error);
          } else {
            console.error('Error fetching chat sessions - Non-JSON response:', errorText);
          }
        } catch (e) {
          console.error('Error fetching chat sessions - Could not parse error as JSON:', errorText);
        }
        return null;
      }
      
      const chatSessions: ChatSession[] = await response.json();
      console.log('Successfully fetched chat sessions:', chatSessions?.length || 0);
      return chatSessions;
    } catch (error) {
      console.error('Error fetching chat sessions - Network error:', error);
      return null;
    }
  }

  async deleteChatSession(sessionId: string): Promise<boolean> {
    try {
      console.log('Deleting chat session:', sessionId);
      const response = await fetch('/api/chat-sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error deleting chat session - HTTP Status:', response.status);
        console.error('Error deleting chat session - Response text:', errorText);
        try {
          // Only try to parse as JSON if it looks like JSON
          if (errorText.trim().startsWith('{') && errorText.trim().endsWith('}')) {
            const error = JSON.parse(errorText);
            console.error('Error deleting chat session - Parsed error:', error);
          } else {
            console.error('Error deleting chat session - Non-JSON response:', errorText);
          }
        } catch (e) {
          console.error('Error deleting chat session - Could not parse error as JSON:', errorText);
        }
        return false;
      }

      const result = await response.json();
      console.log('Successfully deleted chat session:', result);
      return true;
    } catch (error) {
      console.error('Error deleting chat session - Network error:', error);
      return false;
    }
  }
}

export const chatHistoryService = new ChatHistoryService()
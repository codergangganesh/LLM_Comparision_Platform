export interface AIModel {
  id: string;
  displayName: string;
  provider: string;
  description: string;
  capabilities: string[];
}

export interface Conversation {
  id: string;
  title: string;
  message: string;
  responses: ConversationResponse[];
  createdAt: string;
  responseTime?: number;
}

export interface ConversationResponse {
  modelName: string;
  response: string;
}
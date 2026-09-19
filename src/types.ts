export interface User {
  id: number;
  name: string;
  email: string;
  headline?: string;
  avatarUrl?: string;
  platform?: 'linkedin' | 'facebook' | 'instagram' | 'youtube';
  createdAt: string;
}

export type PostTone =
  | 'Professional'
  | 'Motivational'
  | 'Storytelling'
  | 'Achievement'
  | 'Casual'
  | 'Thought Leadership'
  | 'Educational'
  | 'Hiring & Career';

export type PostLength = 'short' | 'medium' | 'long';

export interface PostVariation {
  id: string;
  hook: string;
  content: string;
  hashtags: string[];
  callToAction: string;
  characterCount: number;
  wordCount: number;
  estimatedReadTime: string;
  engagementScore: number;
  tone: string;
}

export interface Post {
  id: number;
  userId: number;
  topic: string;
  tone: string;
  content: string;
  hashtags: string;
  isDraft?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Template {
  id: number;
  name: string;
  category: string;
  structure: string;
  description: string;
  sampleTopic: string;
}

export interface AIRequestLog {
  id: number;
  userId: number;
  promptText: string;
  responseText: string;
  modelName: string;
  tokensUsed: number;
  createdAt: string;
}

export interface GeneratePostRequest {
  topic: string;
  tone: PostTone;
  length: PostLength;
  language: 'en' | 'bn';
  includeEmojis: boolean;
  variationsCount: number;
  targetAudience?: string;
  templateId?: number;
  customNotes?: string;
}

export interface RefinePostRequest {
  currentContent: string;
  refinementType: 'punchier' | 'storytelling' | 'concise' | 'professional' | 'emojis' | 'questions' | 'custom';
  customInstruction?: string;
  language?: 'en' | 'bn';
}

export interface AnalyticsSummary {
  totalPostsGenerated: number;
  totalTokensUsed: number;
  popularTones: { tone: string; count: number }[];
  recentRequests: AIRequestLog[];
  averageLength: number;
}

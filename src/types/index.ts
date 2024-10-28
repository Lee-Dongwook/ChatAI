import { Timestamp } from 'firebase/firestore';
import { Key } from 'react';

// 1. Users
export type UserRole = 'user' | 'admin' | 'premium';

export interface UserPreference {
  theme: 'light' | 'dark';
  language: 'en' | 'ko';
}

export interface User {
  userId: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  role: UserRole;
  profilePicture?: string | null;
  lastLogin: Timestamp;
  preference: UserPreference;
}

// 2. Chats
export type MessageType = 'text' | 'image' | 'link';
export type Sender = 'user' | 'bot';

export interface ChatMessage {
  message: string;
  sender: Sender;
  createdAt: Timestamp;
  type: MessageType;
}

export interface ChatSession {
  id?: Key | null | undefined;
  sessionName: string;
  createdAt: Timestamp;
  lastActivity: Timestamp;
}

// 3. Feedback
export interface Feedback {
  userId: string;
  sessionId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: Timestamp;
}

//4. Analytics
export type AnalyticsEvent =
  | 'message_sent'
  | 'session_started'
  | 'feedback_given';

export interface Analytics {
  userId: string;
  event: AnalyticsEvent;
  createdAt: Timestamp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metaData: Record<string, any>;
}

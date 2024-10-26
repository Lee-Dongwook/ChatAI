import React from 'react';
import { Timestamp } from 'firebase/firestore';

interface MessageBubbleProps {
  message: string;
  sender: 'user' | 'bot';
  timestamp: Timestamp;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  timestamp,
}: MessageBubbleProps) => {
  const isUser = sender === 'user';

  const formattedLastLogin = timestamp.toDate().toLocaleString();

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs p-3 rounded-lg shadow-md ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
      >
        <p className="text-sm">{message}</p>
        <span className="text-xs text-gray-500 block mt-1">
          {formattedLastLogin}
        </span>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { ChatInput } from '@/components/molecules/ChatInput';
import { MessageBubble } from '@/components/molecules/MessageBubble';
import type { ChatMessage } from '@/types';

interface ChatLayoutProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  messages,
  onSendMessage,
  isSending,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.sender}
            message={msg.message}
            sender={msg.sender}
            timestamp={msg.createdAt}
          />
        ))}
      </div>

      <div className="p-2 border-t">
        <ChatInput
          onSendMessage={onSendMessage}
          placeholder="Type your message..."
        />
        {isSending && <p className="text-sm text-gray-500">Sending...</p>}
      </div>
    </div>
  );
};

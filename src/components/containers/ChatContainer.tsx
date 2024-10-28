'use client';

import React from 'react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { ChatLayout } from '@/components/organisms/ChatLayout';
import { Spinner } from '@/components/atoms/Spinner';

interface ChatContainerProps {
  sessionId: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ sessionId }) => {
  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
  } = useChatMessages(sessionId);

  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const handleSendMessage = (message: string) => {
    sendMessage({ message, sender: 'user', sessionId, type: 'text' });
  };

  if (messagesLoading) return <Spinner />;
  if (messagesError)
    return <p className="text-red-500">Failed to load message.</p>;

  return (
    <ChatLayout
      messages={messages}
      onSendMessage={handleSendMessage}
      isSending={isSending}
    />
  );
};
